import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface ResolvedPlaceMarker {
  id: string;
  label: string;
  category: 'studio' | 'parking' | 'transit';
  address: string;
  position: LatLngLiteral;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const PlaceMarkerWithWindow: React.FC<{
  item: ResolvedPlaceMarker;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}> = ({ item, isSelected, onSelect, onClose }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const pinColors =
    item.category === 'studio'
      ? { background: '#C5A880', borderColor: '#9C7E54', glyphColor: '#FFFFFF' }
      : item.category === 'parking'
        ? { background: '#3A7CA5', borderColor: '#285A7A', glyphColor: '#FFFFFF' }
        : { background: '#1A1A1A', borderColor: '#1A1A1A', glyphColor: '#FFFFFF' };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={item.position}
        title={item.label}
        onClick={onSelect}
      >
        <Pin
          background={pinColors.background}
          borderColor={pinColors.borderColor}
          glyphColor={pinColors.glyphColor}
          scale={item.category === 'studio' ? 1.25 : 1.0}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onClose} maxWidth={250}>
          <div className="p-1 space-y-1 text-[#1A1A1A]">
            <p className="text-xs font-semibold">{item.label}</p>
            <p className="text-[11px] text-[#4B5563]">{item.address}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${item.position.lat},${item.position.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3A7CA5] hover:underline pt-1"
            >
              <span>Route starten</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const HavixbeckMapInner: React.FC = () => {
  const placesLib = useMapsLibrary('places');
  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [markers, setMarkers] = useState<ResolvedPlaceMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>('studio-havixbeck');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function loadHavixbeckLocations() {
      try {
        const centerRes = await placesLib!.Place.searchByText({
          textQuery: 'Havixbeck Zentrum, Deutschland',
          fields: ['location', 'displayName', 'formattedAddress'],
          language: 'de',
          region: 'DE',
          maxResultCount: 1,
        });

        const basePlace = centerRes.places?.[0];
        if (!basePlace?.location || cancelled) {
          setLoadError('Standortdaten für Havixbeck konnten nicht geladen werden.');
          return;
        }

        const basePos: LatLngLiteral = {
          lat: basePlace.location.lat(),
          lng: basePlace.location.lng(),
        };

        const resolved: ResolvedPlaceMarker[] = [
          {
            id: 'studio-havixbeck',
            label: 'NATALI elektro-epil · Studio & Akademie',
            category: 'studio',
            address: basePlace.formattedAddress || 'Havixbeck, Münsterland',
            position: basePos,
          },
        ];

        const [parkingRes, transitRes] = await Promise.all([
          placesLib!.Place.searchByText({
            textQuery: 'Parkplatz Havixbeck',
            fields: ['id', 'displayName', 'formattedAddress', 'location'],
            locationBias: basePos,
            language: 'de',
            region: 'DE',
            maxResultCount: 3,
          }),
          placesLib!.Place.searchByText({
            textQuery: 'Bahnhof Havixbeck',
            fields: ['id', 'displayName', 'formattedAddress', 'location'],
            locationBias: basePos,
            language: 'de',
            region: 'DE',
            maxResultCount: 2,
          }),
        ]);

        for (const p of parkingRes.places ?? []) {
          if (p.location) {
            resolved.push({
              id: `parking-${p.id}`,
              label: p.displayName || 'Parkmöglichkeit Havixbeck',
              category: 'parking',
              address: p.formattedAddress || 'Havixbeck',
              position: { lat: p.location.lat(), lng: p.location.lng() },
            });
          }
        }

        for (const t of transitRes.places ?? []) {
          if (t.location) {
            resolved.push({
              id: `transit-${t.id}`,
              label: t.displayName || 'Bahnhof Havixbeck (RB63)',
              category: 'transit',
              address: t.formattedAddress || 'Havixbeck',
              position: { lat: t.location.lat(), lng: t.location.lng() },
            });
          }
        }

        if (!cancelled) {
          setCenter(basePos);
          setMarkers(resolved);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('429') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('Quota')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          setLoadError('Die interaktive Karte konnte vorübergehend nicht geladen werden.');
        }
      }
    }

    void loadHavixbeckLocations();
    return () => {
      cancelled = true;
    };
  }, [placesLib]);

  if (loadError) {
    return <MapFallbackCard message={loadError} />;
  }

  if (!center) {
    return (
      <div className="w-full h-[380px] sm:h-[420px] rounded-2xl bg-[#EBF4FA] border border-[#D6E7F3] flex flex-col items-center justify-center p-6 text-center">
        <MapPin className="w-7 h-7 text-[#3A7CA5] mb-2" />
        <p className="text-sm font-medium text-[#1A1A1A]">
          Standortkarte Havixbeck wird geladen…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#D6E7F3]">
        <GoogleMap
          defaultCenter={center}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {markers.map((item) => (
            <PlaceMarkerWithWindow
              key={item.id}
              item={item}
              isSelected={selectedMarkerId === item.id}
              onSelect={() => setSelectedMarkerId(item.id)}
              onClose={() => setSelectedMarkerId(null)}
            />
          ))}
        </GoogleMap>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B5563]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880]" aria-hidden="true" />
          Studio &amp; Akademie (Havixbeck)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3A7CA5]" aria-hidden="true" />
          Parkmöglichkeiten vor Ort
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" aria-hidden="true" />
          Bahnhof Havixbeck (RB63)
        </span>
      </div>
    </div>
  );
};

const MapFallbackCard: React.FC<{ message?: string }> = ({ message }) => (
  <div className="w-full h-[380px] sm:h-[420px] rounded-2xl bg-gradient-to-br from-[#EBF4FA] via-white to-[#FBF7F1] border border-[#D6E7F3] flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D6E7F3] flex items-center justify-center">
      <MapPin className="w-6 h-6 text-[#3A7CA5]" />
    </div>
    <div className="max-w-md space-y-1.5">
      <p className="text-base font-semibold text-[#1A1A1A]">
        NATALI elektro-epil · 48329 Havixbeck (Münsterland)
      </p>
      <p className="text-xs text-[#4B5563] leading-relaxed">
        {message ||
          'Zentrale Lage in Havixbeck mit kostenfreien Parkmöglichkeiten in unmittelbarer Nähe und direkter Anbindung an die Baumberge-Bahn (RB63).'}
      </p>
    </div>
    <a
      href="https://www.google.com/maps/search/?api=1&query=Havixbeck,+Deutschland"
      target="_blank"
      rel="noopener noreferrer"
      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#333333] transition-colors"
    >
      <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
      <span>Route in Google Maps öffnen</span>
    </a>
  </div>
);

export const HavixbeckMap: React.FC = () => {
  if (!MAPS_API_KEY) {
    return <MapFallbackCard />;
  }

  return (
    <APIProvider apiKey={MAPS_API_KEY} language="de" region="DE" libraries={['places', 'marker']}>
      <HavixbeckMapInner />
    </APIProvider>
  );
};
