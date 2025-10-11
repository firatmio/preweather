import React from 'react';
import ReactDOM from 'react-dom';

export type CoordType = 'latlon' | 'mgrs' | 'utm' | 'dms' | 'dm';

const COORD_TYPES: { key: CoordType; label: string }[] = [
  { key: 'latlon', label: 'dd.ddddddd°' },
  { key: 'mgrs', label: 'MGRS' },
  { key: 'utm', label: 'UTM' },
  { key: 'dms', label: 'dd°mm\'ss.s"' },
  { key: 'dm', label: 'dd°mm.mmm\'' },
];

interface CoordTypeModalProps {
  open: boolean;
  value: CoordType;
  onSelect: (type: CoordType) => void;
  onClose: () => void;
}

export const CoordTypeModal: React.FC<CoordTypeModalProps> = ({ open, value, onSelect, onClose }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="coord-modal-overlay">
      <div className="coord-modal">
        <ul className="coord-type-list">
          {COORD_TYPES.map((t) => (
            <li
              key={t.key}
              className={value === t.key ? 'selected' : ''}
              onClick={() => onSelect(t.key)}
            >
              {t.label}
            </li>
          ))}
        </ul>
        <div className="coord-modal-actions">
          <button type="button" onClick={onClose} className="cancel-btn">İptal</button>
          <button type="button" onClick={onClose} className="ok-btn">Tamam</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
