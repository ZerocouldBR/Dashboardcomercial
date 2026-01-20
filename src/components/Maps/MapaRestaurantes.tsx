import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurante, Localizacao, RegiaoProspeccao, RotaProspeccao } from '../../types';

// Fix para ícones do Leaflet no Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Ícones customizados por tipo e status
const criarIconeCustomizado = (tipo: string, status: string) => {
  let cor = '#3b82f6'; // azul padrão

  // Cor por status
  switch (status) {
    case 'prospecto':
      cor = '#6b7280'; // cinza
      break;
    case 'contatado':
      cor = '#3b82f6'; // azul
      break;
    case 'negociacao':
      cor = '#f59e0b'; // amarelo
      break;
    case 'cliente':
      cor = '#10b981'; // verde
      break;
    case 'recusado':
      cor = '#ef4444'; // vermelho
      break;
  }

  // Emoji por tipo
  let emoji = '🍽️';
  switch (tipo) {
    case 'pizzaria':
      emoji = '🍕';
      break;
    case 'restaurante':
      emoji = '🍽️';
      break;
    case 'hamburgueria':
      emoji = '🍔';
      break;
    case 'churrascaria':
      emoji = '🥩';
      break;
    case 'lanchonete':
      emoji = '🥪';
      break;
    case 'bar':
      emoji = '🍺';
      break;
  }

  return L.divIcon({
    html: `
      <div style="
        background-color: ${cor};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(-45deg);
        font-size: 18px;
      ">
        <span style="transform: rotate(45deg);">${emoji}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Componente para atualizar o centro do mapa
const MapUpdater: React.FC<{ center: Localizacao; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([center.latitude, center.longitude], zoom);
  }, [center, zoom, map]);

  return null;
};

// Componente para tratar cliques no mapa
const MapClickHandler: React.FC<{ onClick?: (localizacao: Localizacao) => void }> = ({ onClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);

  return null;
};

interface MapaRestaurantesProps {
  restaurantes: Restaurante[];
  centro?: Localizacao;
  zoom?: number;
  altura?: string;
  regioes?: RegiaoProspeccao[];
  rota?: RotaProspeccao;
  onRestauranteClick?: (restaurante: Restaurante) => void;
  onMapClick?: (localizacao: Localizacao) => void;
  mostrarControles?: boolean;
}

const MapaRestaurantes: React.FC<MapaRestaurantesProps> = ({
  restaurantes,
  centro = { latitude: -23.5505, longitude: -46.6333 }, // Centro de SP
  zoom = 13,
  altura = '600px',
  regioes = [],
  rota,
  onRestauranteClick,
  onMapClick,
  mostrarControles = true
}) => {
  const [centroAtual, setCentroAtual] = useState(centro);
  const [zoomAtual] = useState(zoom);

  useEffect(() => {
    setCentroAtual(centro);
  }, [centro]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospecto':
        return '#6b7280';
      case 'contatado':
        return '#3b82f6';
      case 'negociacao':
        return '#f59e0b';
      case 'cliente':
        return '#10b981';
      case 'recusado':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPotencialBadge = (potencial: string) => {
    const cores = {
      baixo: 'bg-gray-100 text-gray-800',
      medio: 'bg-blue-100 text-blue-800',
      alto: 'bg-yellow-100 text-yellow-800',
      muito_alto: 'bg-green-100 text-green-800'
    };
    return cores[potencial as keyof typeof cores] || cores.baixo;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      prospecto: 'Prospecto',
      contatado: 'Contatado',
      negociacao: 'Em Negociação',
      cliente: 'Cliente',
      recusado: 'Recusado'
    };
    return labels[status] || status;
  };

  return (
    <div className="relative" style={{ height: altura }}>
      <MapContainer
        center={[centroAtual.latitude, centroAtual.longitude]}
        zoom={zoomAtual}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <MapUpdater center={centroAtual} zoom={zoomAtual} />
        <MapClickHandler onClick={onMapClick} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Regiões de prospecção */}
        {regioes.map((regiao) => {
          if (regiao.tipo === 'circular' && regiao.centro && regiao.raio) {
            return (
              <Circle
                key={regiao.id}
                center={[regiao.centro.latitude, regiao.centro.longitude]}
                radius={regiao.raio}
                pathOptions={{
                  color: regiao.cor,
                  fillColor: regiao.cor,
                  fillOpacity: 0.2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-sm">{regiao.nome}</h3>
                    {regiao.descricao && (
                      <p className="text-xs text-gray-600 mt-1">{regiao.descricao}</p>
                    )}
                    <div className="mt-2 text-xs">
                      <div>Prospectos: {regiao.totalProspectos}</div>
                      <div>Contatados: {regiao.totalContatados}</div>
                      <div>Taxa conversão: {regiao.taxaConversao}%</div>
                    </div>
                  </div>
                </Popup>
              </Circle>
            );
          }
          return null;
        })}

        {/* Rota */}
        {rota && rota.rotaOtimizada.length > 0 && (
          <Polyline
            positions={rota.rotaOtimizada.map((loc) => [loc.latitude, loc.longitude])}
            pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7 }}
          />
        )}

        {/* Marcadores de restaurantes */}
        {restaurantes.map((restaurante) => (
          <Marker
            key={restaurante.id}
            position={[restaurante.localizacao.latitude, restaurante.localizacao.longitude]}
            icon={criarIconeCustomizado(restaurante.tipoEstabelecimento, restaurante.status)}
            eventHandlers={{
              click: () => {
                if (onRestauranteClick) {
                  onRestauranteClick(restaurante);
                }
              }
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-base mb-2">{restaurante.nome}</h3>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(restaurante.status) }}
                    ></span>
                    <span className="font-medium">{getStatusLabel(restaurante.status)}</span>
                  </div>

                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPotencialBadge(restaurante.potencial)}`}>
                      Potencial: {restaurante.potencial.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-2 border-t mt-2">
                    <div className="text-xs text-gray-600">
                      <div><strong>Tipo:</strong> {restaurante.tipoEstabelecimento}</div>
                      {restaurante.categoria && (
                        <div><strong>Categoria:</strong> {restaurante.categoria}</div>
                      )}
                      <div className="mt-1"><strong>Endereço:</strong><br />{restaurante.endereco}</div>
                      {restaurante.telefone && (
                        <div className="mt-1"><strong>Tel:</strong> {restaurante.telefone}</div>
                      )}
                      {restaurante.distanciaFilial && (
                        <div className="mt-1">
                          <strong>Distância:</strong> {restaurante.distanciaFilial.toFixed(2)} km
                        </div>
                      )}
                    </div>
                  </div>

                  {restaurante.observacoes && (
                    <div className="pt-2 border-t mt-2 text-xs text-gray-600">
                      <strong>Obs:</strong> {restaurante.observacoes}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Controles e legenda */}
      {mostrarControles && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-[200px]">
          <h4 className="font-bold text-sm mb-2">Legenda</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span>Prospecto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Contatado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Negociação</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Cliente</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Recusado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaRestaurantes;
