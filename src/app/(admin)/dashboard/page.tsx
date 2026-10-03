"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, Users, Settings, LogOut, Plus, MapPin, 
  Trash2, Edit, ExternalLink, PhoneCall, X, Save, 
  Image as ImageIcon, Sparkles, Loader2, Copy, Search, CheckCircle2, DollarSign,
  TrendingUp, Home, ChevronRight, Menu, AlertCircle,
  Eye, Check, Filter
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"properties" | "crm" | "cities" | "cms">("properties");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");

  // Notificações Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Estados dos dados
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  // Modais & Formulários
  const [modal, setModal] = useState<"property" | "city" | "category" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [propertyModalTab, setPropertyModalTab] = useState<"basic" | "features" | "gallery">("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Estados de IA (Gerador de Textos de Publicação Gemini)
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedAiProperty, setSelectedAiProperty] = useState<any | null>(null);
  const [isAiGeneratingDescription, setIsAiGeneratingDescription] = useState(false);

  const handleGenerateAiMedia = async (property: any) => {
    setSelectedAiProperty(property);
    setShowAiModal(true);
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai/generate-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erro ao conectar com a IA");
      }
      setAiResult(data.data);
    } catch (err: any) {
      setAiResult(`Erro: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateDescriptionForForm = async () => {
    if (!formData.title && !formData.type) {
      showToast("Preencha ao menos o título ou tipo do imóvel na aba 1 antes de gerar a descrição.", "error");
      return;
    }
    setIsAiGeneratingDescription(true);
    try {
      const res = await fetch("/api/ai/generate-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erro ao conectar com a IA");
      }
      
      const fullText = data.data;
      let descText = fullText;
      if (fullText.includes("## 📖 Descrição Completa")) {
        const parts = fullText.split(/## /);
        const descPart = parts.find((p: string) => p.includes("Descrição Completa"));
        if (descPart) {
          descText = descPart.replace(/📖 Descrição Completa para Publicação no Site e Portais\s*\n*/, "").trim();
        }
      }
      
      setFormData((prev: any) => ({
        ...prev,
        description: descText
      }));
      showToast("Descrição gerada e preenchida com sucesso pela IA!");
    } catch (err: any) {
      showToast(`Erro na IA: ${err.message}`, "error");
    } finally {
      setIsAiGeneratingDescription(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resProp, resLeads, resCity, resCat, resSet] = await Promise.all([
        fetch("/api/properties").catch(() => null),
        fetch("/api/crm/leads").catch(() => null),
        fetch("/api/cities").catch(() => null),
        fetch("/api/categories").catch(() => null),
        fetch("/api/content/site-info").catch(() => null),
      ]);

      if (resProp && resProp.ok) {
        const json = await resProp.json();
        if (json.ok) setProperties(json.data || []);
      }
      if (resLeads && resLeads.ok) {
        const json = await resLeads.json();
        if (json.ok) setLeads(json.data || []);
      }
      if (resCity && resCity.ok) {
        const json = await resCity.json();
        if (json.ok) setCities(json.data || []);
      }
      if (resCat && resCat.ok) {
        const json = await resCat.json();
        if (json.ok) setCategories(json.data || []);
      }
      if (resSet && resSet.ok) {
        const json = await resSet.json();
        if (json.ok) setSettings(json.data || {});
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    router.push("/login");
    router.refresh();
  };

  // =====================
  // DELETES
  // =====================
  const deleteProperty = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o imóvel "${title}"?`)) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Imóvel removido com sucesso!");
        fetchAllData();
      } else {
        showToast("Erro ao remover imóvel", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Deseja realmente excluir este lead?")) return;
    try {
      const res = await fetch("/api/crm/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Lead removido com sucesso!");
        fetchAllData();
      }
    } catch {
      showToast("Erro ao excluir lead", "error");
    }
  };

  const deleteCity = async (id: string) => {
    if (!confirm("Deseja excluir esta cidade?")) return;
    try {
      const res = await fetch("/api/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Cidade excluída com sucesso!");
        fetchAllData();
      }
    } catch {
      showToast("Erro ao excluir cidade", "error");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Deseja excluir esta categoria?")) return;
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Categoria excluída com sucesso!");
        fetchAllData();
      }
    } catch {
      showToast("Erro ao excluir categoria", "error");
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        showToast("Status do lead atualizado!");
        fetchAllData();
      }
    } catch {
      showToast("Erro ao atualizar status", "error");
    }
  };

  // =====================
  // MODAL HANDLERS
  // =====================
  const openModal = (type: "property" | "city" | "category", item: any = null) => {
    setModal(type);
    setEditingId(item ? item.id : null);
    setPropertyModalTab("basic");

    if (type === "property") {
      if (item) {
        const feats = Array.isArray(item.features) ? item.features.join("\n") : (item.features || "");
        let loadedImgs = [];
        try {
          loadedImgs = Array.isArray(item.images) ? item.images : JSON.parse(item.images || "[]");
        } catch {
          loadedImgs = [];
        }
        const loadedCaptions = Array.isArray(item.image_captions) ? item.image_captions : [];
        const normalizedImgs = loadedImgs.map((img: any, idx: number) => {
          if (typeof img === "string") {
            return { url: img, caption: loadedCaptions[idx] || "" };
          }
          return { url: img.url || "", caption: img.caption || loadedCaptions[idx] || "" };
        });
        setFormData({
          ...item,
          highlight_tag: item.highlight_tag || "",
          payment_conditions: item.payment_conditions || "",
          purpose: item.purpose || "todos",
          featuresStr: feats,
          images: normalizedImgs,
          featured: Boolean(item.featured)
        });
      } else {
        setFormData({
          title: "",
          type: categories[0]?.name || "Apartamento",
          city: cities[0]?.name || "Gramado",
          status: "Venda",
          price: 0,
          area: 0,
          bedrooms: 0,
          suites: 0,
          bathrooms: 0,
          parking_spots: 0,
          featured: false,
          description: "",
          highlight_tag: "",
          payment_conditions: "",
          purpose: "todos",
          images: [],
          featuresStr: "Vista panorâmica\nLareira a lenha\nChurrasqueira\nEspera para calefação"
        });
      }
    } else if (type === "city") {
      setFormData(item || { name: "", state: "RS" });
    } else if (type === "category") {
      setFormData(item || { name: "", description: "" });
    }
  };

  const closeModal = () => {
    setModal(null);
    setEditingId(null);
    setFormData({});
  };

  // =====================
  // UPLOAD DE IMAGENS
  // =====================
  const uploadFiles = async (files: File[]) => {
    const newImages: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const formPayload = new FormData();
      formPayload.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formPayload });
        const data = await res.json();
        if (data.ok) newImages.push(data.url);
      } catch (err) {
        console.error(err);
      }
    }
    if (newImages.length > 0) {
      const newImgObjects = newImages.map((u) => ({ url: u, caption: "" }));
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...newImgObjects]
      }));
      showToast(`${newImages.length} imagem(ns) adicionada(s)!`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await uploadFiles(Array.from(e.target.files));
  };

  const onDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      await uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: (prev.images || []).map((img: any, i: number) => (i === index ? { ...img, caption } : img))
    }));
  };

  // =====================
  // SALVAMENTO
  // =====================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let url = "";
    let method = editingId ? "PATCH" : "POST";
    let body = { ...formData };

    if (modal === "property") {
      body.features = body.featuresStr ? body.featuresStr.split("\n").map((s: string) => s.trim()).filter(Boolean) : [];
      url = editingId ? `/api/properties/${editingId}` : "/api/properties";
      method = editingId ? "PUT" : "POST";
    } else if (modal === "city") {
      url = "/api/cities";
    } else if (modal === "category") {
      url = "/api/categories";
    }

    if (editingId && method === "PATCH") body.id = editingId;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        showToast(editingId ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
        closeModal();
        fetchAllData();
      } else {
        const err = await res.json();
        showToast("Erro: " + (err.error || "Falha ao salvar"), "error");
      }
    } catch {
      showToast("Erro de conexão ao salvar", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/site-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast("Configurações do site salvas com sucesso!");
      } else {
        showToast("Erro ao salvar configurações", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // =====================
  // MÉTRICAS & FILTROS
  // =====================
  const metrics = useMemo(() => {
    const totalProperties = properties.length;
    const featuredCount = properties.filter((p: any) => p.featured).length;
    const totalLeads = leads.length;
    const newLeads = leads.filter((l: any) => l.status === "novo").length;
    const totalPortfolioValue = properties.reduce((acc: number, p: any) => acc + (Number(p.price) || 0), 0);
    const totalCities = cities.length;

    return { totalProperties, featuredCount, totalLeads, newLeads, totalPortfolioValue, totalCities };
  }, [properties, leads, cities]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p: any) => {
      const matchesSearch = searchQuery === "" || 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = filterCity === "all" || p.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [properties, searchQuery, filterCity]);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 antialiased selection:bg-brand-900 selection:text-white">
      {/* TOAST FLUTUANTE */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
          toast.type === "success" 
            ? "bg-slate-900 text-white border border-emerald-500/40 shadow-emerald-500/10" 
            : "bg-red-900 text-white border border-red-500/40"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="w-72 bg-slate-950 text-white flex-col hidden lg:flex border-r border-slate-800/80 shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-700 via-brand-900 to-slate-950 border border-gold-500/30 flex items-center justify-center font-extrabold text-gold-300 text-lg shadow-inner">
            LA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm tracking-tight text-white">Lázaro Antunes</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">CRECI 088652-F • Gestão</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Principal
          </div>

          <button
            onClick={() => setActiveTab("properties")}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "properties"
                ? "bg-brand-900/90 text-white shadow-lg shadow-brand-950/50 border border-brand-700/50"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className={`w-4 h-4 ${activeTab === "properties" ? "text-gold-400" : "text-slate-400"}`} />
              <span>Imóveis</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "properties" ? "bg-brand-800 text-gold-300" : "bg-slate-800 text-slate-300"}`}>
              {properties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "crm"
                ? "bg-brand-900/90 text-white shadow-lg shadow-brand-950/50 border border-brand-700/50"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 ${activeTab === "crm" ? "text-gold-400" : "text-slate-400"}`} />
              <span>CRM & Leads</span>
            </div>
            {metrics.newLeads > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {metrics.newLeads} novos
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cities")}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "cities"
                ? "bg-brand-900/90 text-white shadow-lg shadow-brand-950/50 border border-brand-700/50"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-4 h-4 ${activeTab === "cities" ? "text-gold-400" : "text-slate-400"}`} />
              <span>Cidades & Tipos</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "cities" ? "bg-brand-800 text-gold-300" : "bg-slate-800 text-slate-300"}`}>
              {cities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "cms"
                ? "bg-brand-900/90 text-white shadow-lg shadow-brand-950/50 border border-brand-700/50"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${activeTab === "cms" ? "text-gold-400" : "text-slate-400"}`} />
              <span>Configurações CMS</span>
            </div>
          </button>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-gold-400" />
              Ver Site Público
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* CORPO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR MOBILE & DESKTOP */}
        <header className="bg-white border-b border-slate-200/90 h-18 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {activeTab === "properties" && "Gestão de Imóveis"}
                {activeTab === "crm" && "CRM & Pipeline de Leads"}
                {activeTab === "cities" && "Cidades & Categorias"}
                {activeTab === "cms" && "Configurações do Site"}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Painel Administrativo Oficial • Lázaro Antunes Imóveis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site</span>
            </Link>

            {activeTab === "properties" && (
              <button
                onClick={() => openModal("property")}
                className="bg-brand-900 hover:bg-brand-950 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 border border-brand-700/30"
              >
                <Plus className="w-4 h-4 text-gold-300" />
                <span>Novo Imóvel</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              title="Sair"
              className="lg:hidden p-2 text-slate-500 hover:text-red-600 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MENU MOBILE EXPANSÍVEL */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 text-white p-4 border-b border-slate-800 space-y-2 animate-in slide-in-from-top-2">
            <button
              onClick={() => { setActiveTab("properties"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === "properties" ? "bg-brand-900 text-white" : "text-slate-300"}`}
            >
              <Building2 className="w-4 h-4 text-gold-400" /> Imóveis ({properties.length})
            </button>
            <button
              onClick={() => { setActiveTab("crm"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === "crm" ? "bg-brand-900 text-white" : "text-slate-300"}`}
            >
              <Users className="w-4 h-4 text-gold-400" /> CRM / Leads ({leads.length})
            </button>
            <button
              onClick={() => { setActiveTab("cities"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === "cities" ? "bg-brand-900 text-white" : "text-slate-300"}`}
            >
              <MapPin className="w-4 h-4 text-gold-400" /> Cidades & Categorias
            </button>
            <button
              onClick={() => { setActiveTab("cms"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === "cms" ? "bg-brand-900 text-white" : "text-slate-300"}`}
            >
              <Settings className="w-4 h-4 text-gold-400" /> Configurações CMS
            </button>
          </div>
        )}

        {/* CONTEÚDO COM ROLAGEM */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* CARDS DE KPIS / MÉTRICAS EXECUTIVAS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Imóveis Ativos</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalProperties}</h3>
                  <p className="text-[11px] text-brand-700 font-semibold mt-1">
                    {metrics.featuredCount} em destaque na home
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contatos / Leads</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalLeads}</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {metrics.newLeads} aguardando contato
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cidades Atendidas</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalCities}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    Gramado, Canela e região
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfólio Total</p>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(metrics.totalPortfolioValue)}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    Valor total de mercado
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* ABA 1: IMÓVEIS */}
            {activeTab === "properties" && (
              <div className="space-y-4">
                {/* Barra de Filtro e Busca */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Pesquisar por título, tipo ou cidade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Filter className="w-3.5 h-3.5" />
                      <span>Cidade:</span>
                    </div>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-900 cursor-pointer"
                    >
                      <option value="all">Todas as Cidades</option>
                      {cities.map((c: any) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tabela de Imóveis */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                  {loading ? (
                    <div className="py-20 text-center text-slate-400 text-sm">Carregando imóveis...</div>
                  ) : filteredProperties.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-slate-600 font-semibold text-sm">Nenhum imóvel encontrado.</p>
                      <button
                        onClick={() => openModal("property")}
                        className="text-xs font-bold text-brand-900 hover:underline cursor-pointer"
                      >
                        Clique aqui para cadastrar um novo imóvel
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200 tracking-wider">
                          <tr>
                            <th className="px-6 py-4">Imóvel</th>
                            <th className="px-6 py-4">Localização & Tipo</th>
                            <th className="px-6 py-4">Destaque</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProperties.map((p: any) => {
                            let imgs = [];
                            try {
                              imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]");
                            } catch {
                              imgs = [];
                            }
                            const mainImg = (typeof imgs[0] === "string" ? imgs[0] : imgs[0]?.url) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";

                            return (
                              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                                      <img
                                        src={mainImg}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-brand-900 transition-colors">
                                        {p.title}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                        <span>{p.bedrooms || 0} qtos</span>
                                        <span>•</span>
                                        <span>{p.area || 0} m²</span>
                                        {p.neighborhood && (
                                          <>
                                            <span>•</span>
                                            <span>{p.neighborhood}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      {p.city}
                                    </span>
                                    <span className="inline-block text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md w-fit">
                                      {p.type}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-6 py-4">
                                  {p.featured ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      <Sparkles className="w-3 h-3 text-amber-500" />
                                      Home
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-medium">Padrão</span>
                                  )}
                                </td>

                                <td className="px-6 py-4 font-extrabold text-slate-900 text-base">
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(p.price) || 0)}
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleGenerateAiMedia(p)}
                                      title="Gerar Textos de Publicação do Anúncio com IA"
                                      className="p-2 text-gold-500 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Sparkles className="w-4 h-4" />
                                    </button>
                                    <Link
                                      href={`/imoveis/${p.id}`}
                                      target="_blank"
                                      title="Ver no site público"
                                      className="p-2 text-slate-400 hover:text-brand-900 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() => openModal("property", p)}
                                      title="Editar Imóvel"
                                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteProperty(p.id, p.title)}
                                      title="Excluir Imóvel"
                                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA 2: CRM & LEADS */}
            {activeTab === "crm" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "novo", title: "Novos Contatos", color: "border-blue-500", bg: "bg-blue-500/10 text-blue-700" },
                    { id: "em_atendimento", title: "Em Atendimento", color: "border-amber-500", bg: "bg-amber-500/10 text-amber-700" },
                    { id: "fechado", title: "Negócios Fechados", color: "border-emerald-500", bg: "bg-emerald-500/10 text-emerald-700" }
                  ].map((column) => {
                    const columnLeads = leads.filter((l: any) => (l.status || "novo") === column.id);

                    return (
                      <div key={column.id} className="bg-slate-200/60 rounded-3xl p-4 flex flex-col gap-3.5 shadow-inner">
                        <div className="flex items-center justify-between px-2 pt-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${column.color.replace("border-", "bg-")}`} />
                            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                              {column.title}
                            </h3>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${column.bg}`}>
                            {columnLeads.length}
                          </span>
                        </div>

                        <div className="space-y-3 min-h-[50vh]">
                          {columnLeads.length === 0 ? (
                            <div className="bg-white/50 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-400">
                              Nenhum lead nesta etapa
                            </div>
                          ) : (
                            columnLeads.map((lead: any) => {
                              const cleanPhone = (lead.phone || "").replace(/\D/g, "");
                              const waMessage = encodeURIComponent(
                                `Olá ${lead.name}! Sou o Lázaro Antunes, corretor de imóveis em Gramado e Canela. Vi seu interesse no imóvel "${lead.property_interest || "em nosso portfólio"}" e estou à disposição para lhe passar todos os detalhes!`
                              );

                              return (
                                <div
                                  key={lead.id}
                                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-brand-900 text-gold-300 font-bold text-xs flex items-center justify-center">
                                        {(lead.name || "L").charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{lead.name}</h4>
                                        <p className="text-[11px] text-slate-400">{lead.phone || "Sem telefone"}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => deleteLead(lead.id)}
                                      title="Excluir Lead"
                                      className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {lead.property_interest && (
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Interesse:</span>
                                      {lead.property_interest}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                    {cleanPhone ? (
                                      <a
                                        href={`https://wa.me/55${cleanPhone}?text=${waMessage}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                      >
                                        <PhoneCall className="w-3 h-3 text-emerald-600" />
                                        <span>WhatsApp</span>
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400">Sem telefone</span>
                                    )}

                                    <select
                                      value={lead.status || "novo"}
                                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                      className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer"
                                    >
                                      <option value="novo">Mover: Novo</option>
                                      <option value="em_atendimento">Mover: Em Atend.</option>
                                      <option value="fechado">Mover: Fechado</option>
                                    </select>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ABA 3: CIDADES & TIPOS */}
            {activeTab === "cities" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gestão de Cidades */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Cidades Atendidas</h3>
                      <p className="text-xs text-slate-400">Locais onde você atua na Serra Gaúcha</p>
                    </div>
                    <button
                      onClick={() => openModal("city")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-950 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cities.map((city: any) => (
                      <div key={city.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-brand-700" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{city.name}</p>
                            <p className="text-xs text-slate-400">{city.state || "RS"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal("city", city)}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCity(city.id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gestão de Categorias */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Categorias & Tipos</h3>
                      <p className="text-xs text-slate-400">Apartamentos, chalés, casas e terrenos</p>
                    </div>
                    <button
                      onClick={() => openModal("category")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-950 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {categories.map((cat: any) => (
                      <div key={cat.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Home className="w-4 h-4 text-brand-700" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{cat.name}</p>
                            <p className="text-xs text-slate-400">{cat.description || "Categoria de imóvel"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal("category", cat)}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: CONFIGURAÇÕES CMS */}
            {activeTab === "cms" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs max-w-3xl space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Dados Institucionais do Corretor</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Essas informações são exibidas nos rodapés, banners e botões de contato do site público.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(settings).filter(([k]) => k.startsWith("broker_")).map(([key, value]) => {
                    const labelName = key.replace("broker_", "").replace("_", " ");

                    return (
                      <div key={key} className={key === "broker_bio" ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                          {labelName}
                        </label>
                        <input
                          type="text"
                          value={value as string || ""}
                          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="bg-brand-900 hover:bg-brand-950 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-gold-300" />
                    <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        
        {/* AI MEDIA MODAL - TEXTOS DE PUBLICAÇÃO DO IMÓVEL */}
        {showAiModal && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-brand-200">
              <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-brand-900 via-brand-850 to-brand-800 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-400" /> Gerador de Textos para Publicação do Imóvel
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Anúncios otimizados para o site oficial e portais imobiliários (ZAP, Viva Real, Imovelweb, OLX)
                  </p>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-white/70 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                  <X className="w-6 h-6"/>
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-brand-900 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-700" />
                    <div className="text-center space-y-1">
                      <p className="font-extrabold text-base text-slate-900">A IA está redigindo o anúncio oficial do imóvel...</p>
                      <p className="text-xs text-slate-500">Criando headline, descrição completa, ficha técnica e resumo para portais.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm whitespace-pre-wrap text-sm leading-relaxed text-slate-800 font-sans select-text">
                      {aiResult}
                    </div>
                  </div>
                )}
              </div>
              {!aiLoading && aiResult && !aiResult.startsWith("Erro") && (
                <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Pronto para copiar e colar no site ou nos portais imobiliários.
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button 
                      onClick={() => { 
                        navigator.clipboard.writeText(aiResult); 
                        showToast("Textos de publicação copiados para a área de transferência!"); 
                      }} 
                      className="bg-brand-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-800 shadow-md transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-gold-300" /> Copiar Textos de Publicação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL DE CADASTRO E EDIÇÃO DE IMÓVEL / CIDADE / CATEGORIA */}
      {/* ======================================================== */}
      {modal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">
                  {editingId ? "Editar" : "Cadastrar"} {modal === "property" ? "Imóvel" : modal === "city" ? "Cidade" : "Categoria"}
                </h3>
                <p className="text-xs text-slate-400">Preencha os dados e salve para atualizar instantaneamente o site.</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center shadow-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Abas para o Modal de Imóvel */}
            {modal === "property" && (
              <div className="flex border-b border-slate-200 px-6 sm:px-8 bg-slate-50/50 gap-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPropertyModalTab("basic")}
                  className={`py-3 border-b-2 transition-all cursor-pointer ${
                    propertyModalTab === "basic"
                      ? "border-brand-900 text-brand-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  1. Dados Principais & Preço
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyModalTab("features")}
                  className={`py-3 border-b-2 transition-all cursor-pointer ${
                    propertyModalTab === "features"
                      ? "border-brand-900 text-brand-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  2. Cômodos & Diferenciais
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyModalTab("gallery")}
                  className={`py-3 border-b-2 transition-all cursor-pointer ${
                    propertyModalTab === "gallery"
                      ? "border-brand-900 text-brand-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  3. Galeria de Fotos ({(formData.images || []).length})
                </button>
              </div>
            )}

            {/* Formulário */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              <form id="crud-form" onSubmit={handleSave} className="space-y-5">
                {/* CIDADE */}
                {modal === "city" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome da Cidade</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Gramado"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Estado (UF)</label>
                      <input
                        required
                        type="text"
                        placeholder="RS"
                        value={formData.state || "RS"}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                )}

                {/* CATEGORIA */}
                {modal === "category" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome da Categoria</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Apartamento, Chalé, Cobertura"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição</label>
                      <input
                        type="text"
                        placeholder="Descrição opcional"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                )}

                {/* IMÓVEL */}
                {modal === "property" && (
                  <>
                    {/* ABA 1: DADOS PRINCIPAIS */}
                    {propertyModalTab === "basic" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título do Imóvel</label>
                          <input
                            required
                            type="text"
                            placeholder="Ex: Apartamento de Luxo com Vista para o Vale em Gramado"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-700 uppercase mb-1.5 flex items-center gap-1">
                            <span>Tag Editorial (Selo Esmeralda no Card)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 1º MCMV de Gramado! | Vista para o Vale"
                            value={formData.highlight_tag || ""}
                            onChange={(e) => setFormData({ ...formData, highlight_tag: e.target.value })}
                            className="w-full border border-emerald-300 bg-emerald-50/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-700 text-emerald-950 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Intenção / Perfil do Comprador
                          </label>
                          <select
                            value={formData.purpose || "todos"}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900 cursor-pointer"
                          >
                            <option value="todos">Vitrine Geral</option>
                            <option value="lancamento">Lançamentos & Na Planta (Investidores)</option>
                            <option value="pronto">Prontos para Morar (Famílias)</option>
                            <option value="temporada">Locação por Temporada (Airbnb/Booking)</option>
                            <option value="terreno">Terrenos & Lotes</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-amber-800 uppercase mb-1.5">
                            Condições de Pagamento / Facilidades Comerciais
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Entrada 10% + 5 reforços + saldo em 84x direto • Aceita veículo"
                            value={formData.payment_conditions || ""}
                            onChange={(e) => setFormData({ ...formData, payment_conditions: e.target.value })}
                            className="w-full border border-amber-300 bg-amber-50/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-700 text-amber-950 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo / Categoria</label>
                          <select
                            value={formData.type || ""}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900 cursor-pointer"
                          >
                            {categories.map((c: any) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Cidade</label>
                          <select
                            value={formData.city || ""}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900 cursor-pointer"
                          >
                            {cities.map((c: any) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bairro / Região</label>
                          <input
                            type="text"
                            placeholder="Ex: Centro, Planalto, Bavária"
                            value={formData.neighborhood || ""}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Preço de Venda (R$)</label>
                          <input
                            required
                            type="number"
                            placeholder="750000"
                            value={formData.price || ""}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-900"
                          />
                          {Boolean(formData.price) && (
                            <p className="text-xs text-brand-700 font-bold mt-1">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(formData.price))}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Área Privativa (m²)</label>
                          <input
                            required
                            type="number"
                            placeholder="120"
                            value={formData.area || ""}
                            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
                          <select
                            value={formData.status || "Venda"}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900 cursor-pointer"
                          >
                            <option value="Venda">Venda</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Vendido">Vendido</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* ABA 2: CÔMODOS & DIFERENCIAIS */}
                    {propertyModalTab === "features" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quartos</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.bedrooms || 0}
                              onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Suítes</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.suites || 0}
                              onChange={(e) => setFormData({ ...formData, suites: Number(e.target.value) })}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Banheiros</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.bathrooms || 0}
                              onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vagas de Garagem</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.parking_spots || 0}
                              onChange={(e) => setFormData({ ...formData, parking_spots: Number(e.target.value) })}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(formData.featured)}
                              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                              className="w-5 h-5 rounded text-brand-900 focus:ring-brand-900 border-slate-300"
                            />
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">
                                Destacar este imóvel na Página Inicial
                              </span>
                              <span className="text-xs text-slate-500">
                                Ele aparecerá na vitrine principal e no topo das buscas recomendadas.
                              </span>
                            </div>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Características & Comodidades (Uma por linha)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Lareira a lenha&#10;Vista panorâmica&#10;Churrasqueira gourmet&#10;Mobiliado e decorado"
                            value={formData.featuresStr || ""}
                            onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase">
                              Descrição Completa do Imóvel
                            </label>
                            <button
                              type="button"
                              onClick={handleGenerateDescriptionForForm}
                              disabled={isAiGeneratingDescription}
                              className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 shadow-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>{isAiGeneratingDescription ? "Redigindo com IA..." : "Gerar Descrição com IA"}</span>
                            </button>
                          </div>
                          <textarea
                            rows={5}
                            placeholder="Descreva detalhadamente o imóvel, os pontos fortes da localização e a infraestrutura do condomínio..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-900 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* ABA 3: GALERIA DE FOTOS */}
                    {propertyModalTab === "gallery" && (
                      <div className="space-y-4">
                        <label
                          onDrop={onDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="w-full h-36 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 hover:bg-brand-50 flex flex-col items-center justify-center text-brand-900 cursor-pointer transition-colors shadow-xs group"
                        >
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-5 h-5 text-brand-900" />
                          </div>
                          <span className="text-sm font-bold">Arraste fotos aqui ou clique para selecionar</span>
                          <span className="text-xs text-slate-500 mt-0.5">Suporta múltiplos arquivos (JPG, PNG, WebP)</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        </label>

                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Fotos Cadastradas ({ (formData.images || []).length }) • A primeira foto será a capa principal
                          </p>

                          {(formData.images || []).length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                              Nenhuma foto adicionada ainda.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {(formData.images || []).map((imgItem: any, idx: number) => {
                                const url = typeof imgItem === "string" ? imgItem : imgItem.url;
                                const caption = typeof imgItem === "string" ? "" : (imgItem.caption || "");

                                return (
                                  <div
                                    key={idx}
                                    className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 group"
                                  >
                                    <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                                      <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                      {idx === 0 && (
                                        <span className="absolute bottom-1.5 left-1.5 bg-brand-950/90 backdrop-blur-xs text-gold-300 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                                          Foto de Capa
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        title="Remover Foto"
                                        className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                        Descrição / Legenda da Foto {idx + 1}:
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ex: Living integrado com sacada gourmet..."
                                        value={caption}
                                        onChange={(e) => updateImageCaption(idx, e.target.value)}
                                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-900"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </form>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <div className="flex items-center gap-3">
                {modal === "property" && propertyModalTab !== "gallery" && (
                  <button
                    type="button"
                    onClick={() => setPropertyModalTab(propertyModalTab === "basic" ? "features" : "gallery")}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-brand-900 bg-brand-100 hover:bg-brand-200 transition-colors cursor-pointer"
                  >
                    Próxima Etapa &rarr;
                  </button>
                )}

                <button
                  type="submit"
                  form="crud-form"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-900 hover:bg-brand-950 transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-gold-300" />
                  <span>{isSaving ? "Salvando..." : "Salvar Dados"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
