use actix_web::{App, HttpResponse, HttpServer, Responder, web};
use futures::future::join_all;
use rand::Rng;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

// 1. Gelen POST isteğinin gövdesini (body) temsil eden struct.
#[derive(Deserialize, Debug)]
struct CalculationRequest {
    day: u32,
    month: u32,
    year: i32,
    latitude: f64,
    longitude: f64,
}

// 2. NASA POWER API'sinden gelen cevabın yapısını temsil eden struct'lar.
#[derive(Deserialize, Debug)]
struct NasaPowerResponse {
    properties: NasaProperties,
}

#[derive(Deserialize, Debug)]
struct NasaProperties {
    parameter: Value,
}

// 3. hackathon.hegsam.casa/prophet adresine göndereceğimiz nihai JSON yapısı.
#[derive(Serialize, Debug)]
struct FinalPayload {
    predict_date: String,
    data: Vec<Value>,
}

// 4. hackathon.hegsam.casa/prophet adresinden gelen cevabı modelleyen struct.
#[derive(Deserialize, Serialize, Debug, Clone)]
#[allow(non_snake_case)]
struct ProphetResponse {
    ALLSKY_KT: HashMap<String, f64>,
    AOD_55_ADJ: HashMap<String, f64>,
    CDD18_3: HashMap<String, f64>,
    FROST_DAYS: HashMap<String, f64>,
    HDD18_3: HashMap<String, f64>,
    PRECSNOLAND: HashMap<String, f64>,
    PRECTOTCORR: HashMap<String, f64>,
    RH2M: HashMap<String, f64>,
    SNODP: HashMap<String, f64>,
    T2M: HashMap<String, f64>,
    T2M_MAX: HashMap<String, f64>,
    T2M_MIN: HashMap<String, f64>,
    WS2M: HashMap<String, f64>,
    percentage: f64,
}

// 5. anyllm API isteği ve cevabı için Struct'lar
#[derive(Serialize)]
struct AnyLlmRequest<'a> {
    message: &'a str,
    mode: &'a str,
    #[serde(rename = "sessionId")]
    session_id: &'a str,
    reset: bool,
}

// GÜNCELLENDİ: LLM cevabındaki "sources" dizisini yeni formata göre modelleyen struct.
#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct Source {
    id: String,
    url: String,
    title: String,
    docAuthor: String,
    description: String,
    docSource: String,
    chunkSource: String,
    published: String,
    wordCount: u32,
    token_count_estimate: u32,
    text: String,
    _distance: f64,
    score: f64,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct Metrics {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
    outputTps: f64,
    duration: f64,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct LlmResponseObject {
    id: String,
    #[serde(rename = "type")]
    response_type: String,
    textResponse: String,
    sources: Vec<Source>,
    close: bool,
    error: Option<String>,
    chatId: u32,
    metrics: Metrics,
}

// LLM'den gelen textResponse içindeki JSON'ı modelleyen struct
#[derive(Deserialize, Debug)]
struct AdviceJson {
    yorum: String,
    öneri: String,
}

// Prophet verisi, LLM tavsiyesi ve NASA verilerini birleştiren nihai cevap struct'ı.
#[derive(Serialize, Debug)]
struct FinalApiResponse {
    prediction_data: ProphetResponse,
    agricultural_advice: String,
    historical_nasa_data: Vec<Value>,
}

// 6. /calculate endpoint'ini handle edecek ana fonksiyon.
async fn calculate(req: web::Json<CalculationRequest>) -> impl Responder {
    println!("İstek alındı: {:?}", req);

    const PARAMETERS: &str = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,WS2M,PRECSNOLAND,AOD_55_ADJ,ALLSKY_KT,RH2M,FROST_DAYS,HDD18_3,CDD18_3,SNODP";
    let client = Client::new();
    let mut tasks = Vec::new();

    for year_to_fetch in (req.year - 25)..req.year {
        let start_date = format!("{:04}{:02}{:02}", year_to_fetch, req.month, req.day);
        let end_date = start_date.clone();

        let url = format!(
            "https://power.larc.nasa.gov/api/temporal/daily/point?parameters={parameters}&community=ag&longitude={lon}&latitude={lat}&start={start}&end={end}&format=JSON&api_key=56LldX9Knsir0c8JIHB2HxL8hl6SekoxDiy9Exlf&units=metric",
            parameters = PARAMETERS,
            lon = req.longitude,
            lat = req.latitude,
            start = start_date,
            end = end_date
        );

        let client_clone = client.clone();
        let task = tokio::spawn(async move {
            let url_for_error = url.clone();
            match client_clone.get(&url).send().await {
                Ok(response) => {
                    let status = response.status();
                    if status.is_success() {
                        match response.text().await {
                            Ok(text) => match serde_json::from_str::<NasaPowerResponse>(&text) {
                                Ok(nasa_data) => Ok(nasa_data.properties.parameter),
                                Err(e) => {
                                    eprintln!(
                                        "\n[NASA HATASI] {} yılı için gelen JSON parse edilemedi.",
                                        year_to_fetch
                                    );
                                    eprintln!(" -> URL: {}", url_for_error);
                                    eprintln!(" -> Hata: {}", e);
                                    eprintln!(" -> Gelen Veri: {}\n", text);
                                    Err(format!("JSON parse error for year {}", year_to_fetch))
                                }
                            },
                            Err(e) => {
                                eprintln!(
                                    "\n[NASA HATASI] {} yılı için cevap gövdesi okunamadı.",
                                    year_to_fetch
                                );
                                eprintln!(" -> URL: {}", url_for_error);
                                eprintln!(" -> Hata: {}\n", e);
                                Err(format!(
                                    "Response body read error for year {}",
                                    year_to_fetch
                                ))
                            }
                        }
                    } else {
                        let error_body = response
                            .text()
                            .await
                            .unwrap_or_else(|_| "Hata detayı okunamadı.".to_string());
                        eprintln!(
                            "\n[NASA HATASI] {} yılı için API'den başarısız statü alındı: {}",
                            year_to_fetch, status
                        );
                        eprintln!(" -> URL: {}", url_for_error);
                        eprintln!(" -> Gelen Hata Cevabı: {}\n", error_body);
                        Err(format!("API error for year {}: {}", year_to_fetch, status))
                    }
                }
                Err(e) => {
                    eprintln!(
                        "\n[NASA HATASI] {} yılı için istek gönderilemedi.",
                        year_to_fetch
                    );
                    eprintln!(" -> URL: {}", url_for_error);
                    eprintln!(" -> Hata: {}\n", e);
                    Err(format!("Request error for year {}", year_to_fetch))
                }
            }
        });
        tasks.push(task);
    }

    let results = join_all(tasks).await;

    let mut all_year_data: Vec<Value> = Vec::new();
    for result in results {
        match result {
            Ok(Ok(data)) => all_year_data.push(data),
            Ok(Err(e)) => {
                eprintln!(
                    "\n[UYGULAMA HATASI] Bir NASA görevi içinde hata oluştu: {}",
                    e
                );
                return HttpResponse::InternalServerError().body(format!("Bir veya daha fazla yıl için veri alınamadı: {}. Detaylar için sunucu loglarını kontrol edin.", e));
            }
            Err(e) => {
                eprintln!(
                    "\n[UYGULAMA HATASI] Paralel görev birleştirme (join) hatası: {}",
                    e
                );
                return HttpResponse::InternalServerError().body(format!(
                    "Paralel görev hatası: {}. Detaylar için sunucu loglarını kontrol edin.",
                    e
                ));
            }
        }
    }

    if all_year_data.is_empty() {
        eprintln!(
            "\n[UYGULAMA HATASI] NASA API'sinden hiçbir yıl için veri alınamadığı için işlem durduruldu."
        );
        return HttpResponse::InternalServerError()
            .body("NASA API'sinden hiçbir yıl için veri alınamadı.");
    }
    println!(
        "Toplam {} yıllık veri başarıyla çekildi.",
        all_year_data.len()
    );

    let predict_date_str = format!("{:04}{:02}{:02}", req.year, req.month, req.day);

    let final_payload = FinalPayload {
        predict_date: predict_date_str.clone(),
        data: all_year_data.clone(),
    };

    let target_url = "http://py-backend:80/predict_all";
    println!("\nNihai veri {} adresine gönderiliyor...", target_url);

    match client.post(target_url).json(&final_payload).send().await {
        Ok(response) => {
            let status = response.status();
            if status.is_success() {
                println!(
                    "Veri başarıyla gönderildi. Cevap Statüsü: {}. Cevap ayrıştırılıyor...",
                    status
                );

                let response_text = match response.text().await {
                    Ok(text) => text,
                    Err(e) => {
                        eprintln!(
                            "\n[PROPHET HATASI] Prophet servisinden gelen cevap gövdesi okunamadı: {}",
                            e
                        );
                        return HttpResponse::InternalServerError()
                            .body("Prophet servisinden gelen cevap okunamadı.");
                    }
                };

                match serde_json::from_str::<ProphetResponse>(&response_text) {
                    Ok(prophet_data) => {
                        let mut prompt_json_map = match serde_json::to_value(&prophet_data) {
                            Ok(Value::Object(map)) => map,
                            _ => {
                                eprintln!(
                                    "\n[UYGULAMA HATASI] ProphetResponse verisi JSON nesnesine çevrilemedi."
                                );
                                return HttpResponse::InternalServerError()
                                    .body("Failed to create prompt JSON.");
                            }
                        };

                        prompt_json_map.insert("latitude".to_string(), Value::from(req.latitude));
                        prompt_json_map.insert("longitude".to_string(), Value::from(req.longitude));

                        let prompt = match serde_json::to_string(&prompt_json_map) {
                            Ok(json_string) => json_string,
                            Err(e) => {
                                eprintln!(
                                    "\n[UYGULAMA HATASI] Nihai prompt JSON string'ine çevrilemedi: {}",
                                    e
                                );
                                return HttpResponse::InternalServerError()
                                    .body("Failed to serialize final prompt.");
                            }
                        };

                        let mut rng = rand::thread_rng();
                        let session_id_num: u32 = rng.gen_range(1_000_000..10_000_000);
                        let session_id_str = session_id_num.to_string();

                        let anyllm_request = AnyLlmRequest {
                            message: &prompt,
                            mode: "chat",
                            session_id: &session_id_str,
                            reset: false,
                        };

                        let anyllm_url = "http://anything-llm:3001/api/v1/workspace/hackathon/chat";
                        println!("LLM'e istek gönderiliyor: {}...", anyllm_url);

                        let anyllm_token = "PBD4SP0-SRJ4VP2-HMFQ498-B9J3BDW";

                        let llm_response = client
                            .post(anyllm_url)
                            .bearer_auth(anyllm_token)
                            .json(&anyllm_request)
                            .send()
                            .await;

                        match llm_response {
                            Ok(res) => {
                                if res.status().is_success() {
                                    match res.text().await {
                                        Ok(text) => {
                                            println!(
                                                "\n[LLM BİLGİ] LLM'den gelen ham cevap:\n{}\n",
                                                text
                                            );
                                            // DÜZELTME: Cevap artık dizi değil, tek bir nesne olarak bekleniyor.
                                            match serde_json::from_str::<LlmResponseObject>(&text) {
                                                Ok(llm_data) => {
                                                    if let Some(err_msg) = &llm_data.error {
                                                        eprintln!(
                                                            "\n[LLM UYARISI] LLM servisinden bir hata mesajı alındı: {}",
                                                            err_msg
                                                        );
                                                    }

                                                    let raw_advice = &llm_data.textResponse;

                                                    let cleaned_advice_str = raw_advice
                                                        .strip_prefix("```json")
                                                        .unwrap_or(raw_advice)
                                                        .strip_suffix("```")
                                                        .unwrap_or(raw_advice)
                                                        .trim();

                                                    let formatted_advice = if cleaned_advice_str
                                                        .starts_with('{')
                                                        && cleaned_advice_str.ends_with('}')
                                                    {
                                                        match serde_json::from_str::<AdviceJson>(
                                                            cleaned_advice_str,
                                                        ) {
                                                            Ok(advice) => {
                                                                format!(
                                                                    "{}\n\n{}",
                                                                    advice.yorum, advice.öneri
                                                                )
                                                            }
                                                            Err(e) => {
                                                                eprintln!(
                                                                    "\n[LLM UYARISI] LLM'den gelen metin JSON'a benziyordu ama parse edilemedi."
                                                                );
                                                                eprintln!(" -> Hata: {}", e);
                                                                eprintln!(
                                                                    " -> Parse edilmeye çalışılan metin: {}\n",
                                                                    cleaned_advice_str
                                                                );
                                                                llm_data.textResponse.clone()
                                                            }
                                                        }
                                                    } else {
                                                        println!(
                                                            "\n[LLM BİLGİ] LLM'den gelen cevap JSON formatında değil, doğrudan metin olarak kullanılıyor."
                                                        );
                                                        llm_data.textResponse.clone()
                                                    };

                                                    let final_api_response = FinalApiResponse {
                                                        prediction_data: prophet_data,
                                                        agricultural_advice: formatted_advice,
                                                        historical_nasa_data: all_year_data,
                                                    };
                                                    println!(
                                                        "LLM'den metin alındı, nihai cevap birleştiriliyor."
                                                    );
                                                    HttpResponse::Ok().json(final_api_response)
                                                }
                                                Err(e) => {
                                                    eprintln!(
                                                        "\n[LLM HATASI] LLM cevabı beklenen formatta (nesne) parse edilemedi."
                                                    );
                                                    eprintln!(" -> Hata: {}", e);
                                                    eprintln!(" -> GELEN HAM CEVAP: {}\n", text);
                                                    HttpResponse::InternalServerError()
                                                        .body("Could not parse LLM response.")
                                                }
                                            }
                                        }
                                        Err(e) => {
                                            eprintln!(
                                                "\n[LLM HATASI] LLM'den gelen cevap gövdesi okunamadı: {}",
                                                e
                                            );
                                            HttpResponse::InternalServerError()
                                                .body("Failed to read LLM response body.")
                                        }
                                    }
                                } else {
                                    let status = res.status();
                                    let error_body = res
                                        .text()
                                        .await
                                        .unwrap_or_else(|_| "Hata detayı okunamadı".to_string());
                                    eprintln!(
                                        "\n[LLM HATASI] LLM API'den başarısız statü alındı: {}",
                                        status
                                    );
                                    eprintln!(" -> Gelen Hata Cevabı: {}\n", error_body);
                                    HttpResponse::InternalServerError()
                                        .body("LLM API returned an error.")
                                }
                            }
                            Err(e) => {
                                eprintln!("\n[LLM HATASI] LLM API'ye istek gönderilemedi.");
                                eprintln!(" -> URL: {}", anyllm_url);
                                eprintln!(" -> Hata: {}", e);
                                HttpResponse::InternalServerError()
                                    .body("Failed to send request to LLM.")
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!(
                            "\n[PROPHET HATASI] Prophet servisinden gelen JSON cevap parse edilemedi."
                        );
                        eprintln!(" -> Hata: {}", e);
                        eprintln!(" -> Gelen Ham Veri: {}\n", response_text);
                        HttpResponse::InternalServerError()
                            .body("Could not parse response from prophet service.")
                    }
                }
            } else {
                let error_body = response
                    .text()
                    .await
                    .unwrap_or_else(|_| "Hata detayı okunamadı.".to_string());
                eprintln!("\n[PROPHET HATASI] Prophet servisine gönderim başarısız oldu.");
                eprintln!(" -> URL: {}", target_url);
                eprintln!(" -> Statü Kodu: {}", status);
                eprintln!(" -> Gelen Hata Cevabı: {}\n", error_body);
                HttpResponse::InternalServerError().body(format!(
                    "Veri gönderilemedi. Statü: {}. Detay: {}",
                    status, error_body
                ))
            }
        }
        Err(e) => {
            eprintln!("\n[PROPHET HATASI] Prophet servisine istek gönderilirken hata oluştu.");
            eprintln!(" -> URL: {}", target_url);
            eprintln!(" -> Hata: {}\n", e);
            HttpResponse::InternalServerError()
                .body(format!("Prophet servisine istek gönderilemedi: {}", e))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Sunucu http://0.0.0.0:6161 adresinde başlatılıyor...");
    HttpServer::new(|| App::new().route("/calculate", web::post().to(calculate)))
        .bind("0.0.0.0:6161")?
        .run()
        .await
}
