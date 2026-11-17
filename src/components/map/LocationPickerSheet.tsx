"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { reverseGeocode } from "@/lib/weather";
import { notify } from "@/lib/toast";
import { Crosshair, MapPin } from "lucide-react";

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009]; // Hồ Chí Minh
const DEFAULT_ZOOM = 6;
const PICKED_ZOOM = 15;

const MARKER_ICON_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const MARKER_ICON_2X_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const MARKER_SHADOW_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

export function LocationPickerSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const setHomeLocation = useAppStore((s) => s.setHomeLocation);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(
    homeProfile?.location ? { lat: homeProfile.location.lat, lng: homeProfile.location.lng } : null
  );
  const [address, setAddress] = useState<string | undefined>(homeProfile?.location?.address);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const handlePick = useCallback((lat: number, lng: number) => {
    setPicked({ lat, lng });
    setAddress(undefined);
    setGeocoding(true);
    reverseGeocode(lat, lng).then((addr) => {
      setAddress(addr);
      setGeocoding(false);
    });
  }, []);

  useEffect(() => {
    if (!open || !mapContainerRef.current || mapRef.current) return;

    let map: LeafletMap;

    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;

      const icon = L.icon({
        iconUrl: MARKER_ICON_URL,
        iconRetinaUrl: MARKER_ICON_2X_URL,
        shadowUrl: MARKER_SHADOW_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const start = picked ?? { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] };
      map = L.map(mapContainerRef.current).setView(
        [start.lat, start.lng],
        picked ? PICKED_ZOOM : DEFAULT_ZOOM
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      if (picked) {
        markerRef.current = L.marker([picked.lat, picked.lng], { icon, draggable: true }).addTo(map);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current!.getLatLng();
          handlePick(pos.lat, pos.lng);
        });
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current!.getLatLng();
            handlePick(pos.lat, pos.lng);
          });
        }
        handlePick(lat, lng);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map is initialized once per open, not re-run on `picked`
  }, [open]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      notify.error("Thiết bị không hỗ trợ định vị");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handlePick(latitude, longitude);
        mapRef.current?.setView([latitude, longitude], PICKED_ZOOM);
        import("leaflet").then((L) => {
          const icon = L.icon({
            iconUrl: MARKER_ICON_URL,
            iconRetinaUrl: MARKER_ICON_2X_URL,
            shadowUrl: MARKER_SHADOW_URL,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          });
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else if (mapRef.current) {
            markerRef.current = L.marker([latitude, longitude], { icon, draggable: true }).addTo(
              mapRef.current
            );
            markerRef.current.on("dragend", () => {
              const p = markerRef.current!.getLatLng();
              handlePick(p.lat, p.lng);
            });
          }
        });
        setLocating(false);
      },
      () => {
        notify.error("Không lấy được vị trí hiện tại. Hãy cấp quyền định vị cho trình duyệt.");
        setLocating(false);
      }
    );
  };

  const handleSave = () => {
    if (!picked) return;
    setHomeLocation({ lat: picked.lat, lng: picked.lng, address });
    notify.success("Đã lưu vị trí ngôi nhà");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Vị trí ngôi nhà" className="sm:max-w-lg">
      <div className="pt-1 space-y-4">
        <p className="text-sm text-text-secondary">
          Chạm vào bản đồ hoặc kéo ghim để chọn đúng vị trí nhà bạn — giúp hiển thị dự báo thời
          tiết chính xác cho khu vực.
        </p>

        <Button
          variant="outline"
          className="w-full"
          onClick={useCurrentLocation}
          disabled={locating}
        >
          <Crosshair size={16} />
          {locating ? "Đang định vị..." : "Dùng vị trí hiện tại"}
        </Button>

        <div
          ref={mapContainerRef}
          className="h-64 w-full rounded-2xl overflow-hidden border border-border bg-surface-2"
        />

        {picked && (
          <div className="rounded-2xl bg-surface-2 p-3 flex items-start gap-2.5">
            <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-text-primary leading-snug">
              {geocoding ? "Đang xác định địa chỉ..." : address ?? "Chưa xác định được địa chỉ"}
            </p>
          </div>
        )}

        <Button className="w-full" size="lg" disabled={!picked} onClick={handleSave}>
          Lưu vị trí
        </Button>
      </div>
    </Sheet>
  );
}
