"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Cable, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CableType {
  id: string;
  name: string;
  description: string | null;
}

interface CableConnector {
  id: string;
  name: string;
  type: string;
  cableTypeId: string;
}

export default function ConfigurateurCablesPage() {
  const [cableTypes, setCableTypes] = useState<CableType[]>([]);
  const [connectors, setConnectors] = useState<CableConnector[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [connector1, setConnector1] = useState<string>("");
  const [connector2, setConnector2] = useState<string>("");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteData, setQuoteData] = useState({
    name: "",
    email: "",
    phone: "",
    length: "",
    message: "",
  });

  useEffect(() => {
    fetchCableTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchConnectors(selectedType);
    }
  }, [selectedType]);

  async function fetchCableTypes() {
    try {
      const response = await fetch("/api/cable-types");
      const data = await response.json();
      setCableTypes(data);
    } catch (error) {
      console.error("Error fetching cable types:", error);
    }
  }

  async function fetchConnectors(typeId: string) {
    try {
      const response = await fetch(`/api/cable-connectors?typeId=${typeId}`);
      const data = await response.json();
      setConnectors(data);
    } catch (error) {
      console.error("Error fetching connectors:", error);
    }
  }

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteData,
          subject: `Demande de devis câble: ${cableTypes.find(t => t.id === selectedType)?.name}`,
          configurationType: "cable",
          connector1Id: connector1,
          connector2Id: connector2,
          cableTypeId: selectedType,
        }),
      });
      
      if (response.ok) {
        setQuoteSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
    }
  }

  const isConfigComplete = selectedType && connector1 && connector2;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Configurateur de Câbles
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Configurez votre câble sur mesure étape par étape
            </p>
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto border-2 border-purple-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <Cable className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Configurez votre câble</CardTitle>
              <CardDescription>
                Sélectionnez le type de câble et les connecteurs pour obtenir un devis personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showQuoteForm ? (
                <div className="space-y-8">
                  {/* Step 1: Cable Type */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedType ? "bg-green-500 text-white" : "bg-purple-100 text-purple-600"
                      }`}>
                        {selectedType ? <Check className="h-5 w-5" /> : "1"}
                      </div>
                      <Label className="text-lg font-medium">Choisissez le type de câble</Label>
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un type de câble" />
                      </SelectTrigger>
                      <SelectContent>
                        {cableTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Connector 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        connector1 ? "bg-green-500 text-white" : "bg-purple-100 text-purple-600"
                      }`}>
                        {connector1 ? <Check className="h-5 w-5" /> : "2"}
                      </div>
                      <Label className="text-lg font-medium">Choisissez le premier connecteur</Label>
                    </div>
                    <Select value={connector1} onValueChange={setConnector1} disabled={!selectedType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez le connecteur 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectors.map((connector) => (
                          <SelectItem key={connector.id} value={connector.id}>
                            {connector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 3: Connector 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        connector2 ? "bg-green-500 text-white" : "bg-purple-100 text-purple-600"
                      }`}>
                        {connector2 ? <Check className="h-5 w-5" /> : "3"}
                      </div>
                      <Label className="text-lg font-medium">Choisissez le second connecteur</Label>
                    </div>
                    <Select value={connector2} onValueChange={setConnector2} disabled={!selectedType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez le connecteur 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectors.map((connector) => (
                          <SelectItem key={connector.id} value={connector.id}>
                            {connector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Configuration Summary */}
                  {isConfigComplete && (
                    <div className="bg-purple-50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-purple-900">Récapitulatif de votre configuration</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> {cableTypes.find(t => t.id === selectedType)?.name}</p>
                        <p><span className="font-medium">Connecteur 1:</span> {connectors.find(c => c.id === connector1)?.name}</p>
                        <p><span className="font-medium">Connecteur 2:</span> {connectors.find(c => c.id === connector2)?.name}</p>
                      </div>
                      <Button 
                        onClick={() => setShowQuoteForm(true)} 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Demander un devis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : !quoteSubmitted ? (
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <h3 className="text-lg font-semibold">Demande de devis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quote-name">Nom complet *</Label>
                      <Input
                        id="quote-name"
                        required
                        value={quoteData.name}
                        onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-email">Email *</Label>
                      <Input
                        id="quote-email"
                        type="email"
                        required
                        value={quoteData.email}
                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quote-phone">Téléphone</Label>
                      <Input
                        id="quote-phone"
                        value={quoteData.phone}
                        onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-length">Longueur souhaitée (mètres)</Label>
                      <Input
                        id="quote-length"
                        type="number"
                        value={quoteData.length}
                        onChange={(e) => setQuoteData({ ...quoteData, length: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-message">Message complémentaire</Label>
                    <Textarea
                      id="quote-message"
                      rows={3}
                      value={quoteData.message}
                      onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>
                      Retour
                    </Button>
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer la demande
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Demande envoyée !</h3>
                  <p className="text-gray-600 mb-6">
                    Nous vous contacterons rapidement avec un devis personnalisé.
                  </p>
                  <Button asChild>
                    <Link href="/">Retour à l&apos;accueil</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
