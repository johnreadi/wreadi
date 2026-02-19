"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  reference: string | null;
  description: string | null;
  price: number | null;
  brand: string | null;
  series: string | null;
  model: string | null;
  stock: number;
}

export default function PiecesDetacheesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter series based on selected brand
    if (selectedBrand) {
      const filteredSeries = products
        .filter((p) => p.brand === selectedBrand)
        .map((p) => p.series)
        .filter((s): s is string => s !== null);
      setSeries(Array.from(new Set(filteredSeries)));
      setSelectedSeries("");
      setSelectedModel("");
    } else {
      const allSeries = products.map((p) => p.series).filter((s): s is string => s !== null);
      setSeries(Array.from(new Set(allSeries)));
    }
  }, [selectedBrand, products]);

  useEffect(() => {
    // Filter models based on selected brand and series
    if (selectedBrand || selectedSeries) {
      const filteredModels = products
        .filter((p) => (!selectedBrand || p.brand === selectedBrand) && (!selectedSeries || p.series === selectedSeries))
        .map((p) => p.model)
        .filter((m): m is string => m !== null);
      setModels(Array.from(new Set(filteredModels)));
      setSelectedModel("");
    } else {
      const allModels = products.map((p) => p.model).filter((m): m is string => m !== null);
      setModels(Array.from(new Set(allModels)));
    }
  }, [selectedSeries, selectedBrand, products]);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      
      // Extract unique brands
      const allBrands = data.map((p: Product) => p.brand).filter((b: string | null): b is string => b !== null);
      setBrands(Array.from(new Set(allBrands)));
      
      const allSeries = data.map((p: Product) => p.series).filter((s: string | null): s is string => s !== null);
      setSeries(Array.from(new Set(allSeries)));
      
      const allModels = data.map((p: Product) => p.model).filter((m: string | null): m is string => m !== null);
      setModels(Array.from(new Set(allModels)));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesSeries = !selectedSeries || product.series === selectedSeries;
    const matchesModel = !selectedModel || product.model === selectedModel;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSeries && matchesModel && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-red-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pièces Détachées
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Configurateur de produits compatibles avec votre système
            </p>
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/configurateur-cables">
                Configurateur de câbles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-orange-600" />
                Configurateur - Trouvez les produits compatibles avec votre système
              </CardTitle>
              <CardDescription>
                Sélectionnez votre marque, série et modèle pour trouver les produits compatibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Étape 1 : Marque</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les marques</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Étape 2 : Série</label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries} disabled={!selectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une série" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les séries</SelectItem>
                      {series.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Étape 3 : Modèle</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les modèles</SelectItem>
                      {models.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Produits disponibles
              <Badge variant="secondary" className="ml-2">
                {filteredProducts.length}
              </Badge>
            </h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
              <p className="text-sm text-gray-400 mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="text-sm">
                          Réf: {product.reference || "N/A"}
                        </CardDescription>
                      </div>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? "En stock" : "Rupture"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {product.brand && <span className="mr-2">{product.brand}</span>}
                        {product.series && <span className="mr-2">{product.series}</span>}
                        {product.model && <span>{product.model}</span>}
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {product.price ? `${product.price.toFixed(2)} €` : "Sur demande"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
