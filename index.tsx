import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const mockTeachers = [
  { id: 1, name: "Alice Nguyen", instrument: "Piano", lat: 47.6097, lng: -122.3331 },
  { id: 2, name: "Carlos Diaz", instrument: "Violin", lat: 47.6062, lng: -122.3321 },
  { id: 3, name: "Emily Zhao", instrument: "Guitar", lat: 47.6101, lng: -122.3421 },
  { id: 4, name: "Tom Becker", instrument: "Voice", lat: 47.6136, lng: -122.3456 },
];

export default function MaestroHomePage() {
  const [query, setQuery] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState(mockTeachers);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setFilteredTeachers(
      mockTeachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query.toLowerCase()) ||
          teacher.instrument.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  return (
    <div className="p-6 space-y-8">
      <motion.h1
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Maestro – Find Your Music Teacher in Seattle
      </motion.h1>

      <div className="max-w-xl mx-auto flex gap-2">
        <Input
          placeholder="Search by name or instrument..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => setQuery("")}>Clear</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{teacher.name}</h2>
                <p className="text-gray-600">Teaches: {teacher.instrument}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isClient && (
          <MapContainer
            center={[47.6062, -122.3321]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredTeachers.map((teacher) => (
              <Marker key={teacher.id} position={[teacher.lat, teacher.lng]}>
                <Popup>
                  <strong>{teacher.name}</strong>
                  <br />
                  {teacher.instrument}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
