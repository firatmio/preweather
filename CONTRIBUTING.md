# Katkıda Bulunma Rehberi

PreWeather projesine katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Development Kurulumu](#development-kurulumu)
- [Commit Kuralları](#commit-kuralları)
- [Pull Request Süreci](#pull-request-süreci)
- [Kod Standartları](#kod-standartları)

## 🤝 Davranış Kuralları

- Saygılı ve yapıcı olun
- Farklı görüşlere açık olun
- Yeni başlayanlara yardımcı olun
- Profesyonel bir dil kullanın

## 💡 Nasıl Katkıda Bulunabilirim?

### Bug Bildirimi

1. [Issues](https://github.com/firatmio/preweather/issues) sayfasından yeni issue açın
2. Bug template'ini kullanın
3. Detaylı açıklama ekleyin:
   - Adımları tekrarlama
   - Beklenen davranış
   - Gerçekleşen davranış
   - Screenshots (varsa)
   - Tarayıcı & OS bilgisi

### Özellik İsteği

1. Önce [Discussions](https://github.com/firatmio/preweather/discussions) bölümünde tartışın
2. Topluluktan geri bildirim alın
3. Onaylandıktan sonra issue açın
4. Detaylı açıklama ekleyin:
   - Kullanım senaryosu
   - Beklenen fayda
   - Örnek implementasyon (opsiyonel)

### Kod Katkısı

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi yapın
4. Test edin
5. Pull Request açın

## 🛠️ Development Kurulumu

### Gereksinimler

```bash
node --version  # v18+
npm --version   # v9+
```

### Kurulum Adımları

```bash
# 1. Fork'u klonlayın
git clone https://github.com/firatmio/preweather.git
cd preweather

# 2. Upstream ekleyin
git remote add upstream https://github.com/firatmio/preweather.git

# 3. Bağımlılıkları yükleyin
npm install

# 4. Environment dosyasını oluşturun
cp .env.example .env.local
# .env.local dosyasını düzenleyin

# 5. Development sunucusunu başlatın
npm run dev
```

### Branch Yapısı

```
main           # Production branch (protected)
  └── dev      # Development branch
       └── feature/your-feature  # Your feature branch
```

## 📝 Commit Kuralları

Conventional Commits standardını kullanıyoruz:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type'lar

- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı (işlevselliği etkilemez)
- `refactor`: Kod yeniden yapılandırma
- `perf`: Performans iyileştirmesi
- `test`: Test ekleme/düzeltme
- `chore`: Build, dependencies vb.
- `ci`: CI/CD değişiklikleri

### Scope'lar (Opsiyonel)

- `app`: Ana uygulama
- `api`: API layer
- `ui`: UI components
- `map`: Harita özellikleri
- `i18n`: Çeviri
- `docs`: Dokümantasyon

### Örnekler

```bash
# Basit commit
git commit -m "feat: add weather prediction history"

# Detaylı commit
git commit -m "feat(map): add location clustering

- Cluster nearby locations
- Show cluster count
- Zoom in on cluster click

Closes #123"

# Breaking change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns nested objects"

# Bug fix
git commit -m "fix(ui): correct date picker validation

Previous validation allowed past dates"
```

## 🔄 Pull Request Süreci

### 1. Branch Oluşturma

```bash
# Main'den güncelleyin
git checkout main
git pull upstream main

# Feature branch oluşturun
git checkout -b feature/amazing-feature
```

### 2. Değişiklikler

```bash
# Kod değişiklikleri yapın
# ...

# Stage & Commit
git add .
git commit -m "feat: add amazing feature"
```

### 3. Sync & Push

```bash
# Upstream'den pull edin
git checkout main
git pull upstream main
git checkout feature/amazing-feature
git rebase main

# Push edin
git push origin feature/amazing-feature
```

### 4. PR Açma

1. GitHub'da "New Pull Request" tıklayın
2. Base: `main` ← Compare: `feature/amazing-feature`
3. PR template'ini doldurun:
   - **Açıklama**: Ne değişti?
   - **Motivasyon**: Neden gerekli?
   - **Test**: Nasıl test edildi?
   - **Screenshots**: Varsa ekleyin
   - **Checklist**: Tamamlayın
4. "Create Pull Request" tıklayın

### 5. Review Süreci

- CI checks'lerin geçmesini bekleyin
- Review'lara yanıt verin
- Gerekli değişiklikleri yapın
- Merge onayı bekleyin

## ✅ Kod Standartları

### TypeScript

```typescript
// ✅ İyi
interface WeatherData {
  temperature: number
  humidity: number
}

function getPrediction(data: WeatherData): number {
  return data.temperature * 1.8 + 32
}

// ❌ Kötü
function getPrediction(data: any) {
  return data.temperature * 1.8 + 32
}
```

### React Components

```tsx
// ✅ İyi - Functional component with TypeScript
interface Props {
  title: string
  onClose: () => void
}

export function Modal({ title, onClose }: Props) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

// ❌ Kötü - Class component without types
export class Modal extends React.Component {
  render() {
    return <div>{this.props.title}</div>
  }
}
```

### CSS

```css
/* ✅ İyi - BEM notation */
.weather-card {
  padding: 1rem;
}

.weather-card__title {
  font-size: 1.5rem;
}

.weather-card__title--large {
  font-size: 2rem;
}

/* ❌ Kötü - Generic selectors */
.card {
  padding: 1rem;
}

.title {
  font-size: 1.5rem;
}
```

### Naming Conventions

```typescript
// Variables & Functions: camelCase
const weatherData = {}
function calculateTemperature() {}

// Components: PascalCase
function WeatherCard() {}
function MapContainer() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRIES = 3

// Private: _prefix
const _internalHelper = () => {}
```

### ESLint & Prettier

```bash
# Linting
npm run lint

# Auto-fix
npm run lint -- --fix

# Format check
npx prettier --check "src/**/*.{ts,tsx}"

# Auto-format
npx prettier --write "src/**/*.{ts,tsx}"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Test Örneği

```typescript
import { render, screen } from '@testing-library/react'
import { WeatherCard } from './WeatherCard'

describe('WeatherCard', () => {
  it('renders temperature correctly', () => {
    render(<WeatherCard temperature={25} />)
    expect(screen.getByText('25°C')).toBeInTheDocument()
  })

  it('calls onClose when button clicked', () => {
    const onClose = jest.fn()
    render(<WeatherCard onClose={onClose} />)
    
    screen.getByText('Close').click()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

## 📚 Dokümantasyon

### JSDoc Comments

```typescript
/**
 * Calculates the temperature in Fahrenheit
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 * @example
 * ```ts
 * const fahrenheit = celsiusToFahrenheit(25)
 * console.log(fahrenheit) // 77
 * ```
 */
function celsiusToFahrenheit(celsius: number): number {
  return celsius * 1.8 + 32
}
```

### Component Documentation

```tsx
/**
 * Weather card component that displays prediction data
 * 
 * @component
 * @example
 * ```tsx
 * <WeatherCard
 *   temperature={25}
 *   humidity={60}
 *   onClose={() => console.log('closed')}
 * />
 * ```
 */
export function WeatherCard(props: WeatherCardProps) {
  // ...
}
```

## 🎯 PR Checklist

Pull Request açmadan önce kontrol edin:

- [ ] Kod TypeScript type-safe
- [ ] ESLint errors yok
- [ ] Testler yazıldı ve geçiyor
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları kurallara uygun
- [ ] Branch güncel (rebase edildi)
- [ ] Screenshots eklendi (UI değişikliği varsa)
- [ ] Breaking change varsa belirtildi

## 🚀 Release Süreci

Maintainer'lar için:

```bash
# Version bump
npm version patch|minor|major

# Tag push
git push --tags

# GitHub Release oluştur
# - Changelog ekle
# - Binary'leri ekle (varsa)
```

## 💬 İletişim

- 💻 **GitHub Issues**: Teknik sorular
- 💬 **Discussions**: Genel tartışmalar
- 📧 **Email**: Özel konular

## 🙏 Teşekkürler

Katkılarınız için teşekkür ederiz! Her katkı, küçük ya da büyük, projeyi daha iyi hale getirir. 🚀

---

<div align="center">

**Happy Coding! 💻☕**

</div>
