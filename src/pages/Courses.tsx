
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Filter, Search } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Mock data for courses with more affordable pricing
const coursesData = [
  {
    id: 1,
    title: "Desenvolvimento Web Full Stack",
    provider: "Tech Academy",
    duration: "120 horas",
    level: "Intermediário",
    price: "R$ 49,90",
    rating: 4.8,
    certificationIncluded: true,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    categories: ["Programação", "Web", "JavaScript"]
  },
  {
    id: 2,
    title: "Excel Avançado para Análise de Dados",
    provider: "Business Skills",
    duration: "40 horas",
    level: "Avançado",
    price: "R$ 29,90",
    rating: 4.5,
    certificationIncluded: true,
    image: "https://images.unsplash.com/photo-1606337321936-02d1b1a4d5ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    categories: ["Excel", "Análise de Dados", "Negócios"]
  },
  {
    id: 3,
    title: "Marketing Digital Completo",
    provider: "Marketing Pro",
    duration: "80 horas",
    level: "Iniciante a Avançado",
    price: "R$ 39,90",
    rating: 4.7,
    certificationIncluded: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    categories: ["Marketing", "Digital", "Social Media"]
  },
  {
    id: 4,
    title: "Gestão de Projetos com Metodologias Ágeis",
    provider: "PM Academy",
    duration: "60 horas",
    level: "Intermediário",
    price: "R$ 34,90",
    rating: 4.6,
    certificationIncluded: true,
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    categories: ["Gestão", "Agile", "Scrum"]
  },
  {
    id: 5,
    title: "Design UX/UI Profissional",
    provider: "Design School",
    duration: "100 horas",
    level: "Iniciante a Avançado",
    price: "R$ 49,90",
    rating: 4.9,
    certificationIncluded: true,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    categories: ["Design", "UX", "UI"]
  }
];

// Course categories for filtering
const categories = ["Programação", "Web", "JavaScript", "Excel", "Análise de Dados", "Negócios", "Marketing", "Digital", "Social Media", "Gestão", "Agile", "Scrum", "Design", "UX", "UI"];

// Course Card Component
const CourseCard = ({ course }) => {
  return (
    <Card className="overflow-hidden card-hover bg-white dark:bg-gray-800">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {course.certificationIncluded && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Certificado
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading text-gray-900 dark:text-white">{course.title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">{course.provider}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Duração: {course.duration}</span>
          <span className="font-medium text-brand-600 dark:text-brand-400">{course.price}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {course.categories.map(category => (
            <Badge key={category} variant="secondary" className="text-xs">{category}</Badge>
          ))}
        </div>
        <div className="flex items-center mt-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Nível: {course.level}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
};

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  // Função auxiliar para extrair valor numérico do preço
  const extractPrice = (priceString) => {
    if (priceString === "Gratuito") return 0;
    const match = priceString.match(/R\$\s*([\d,]+)/);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
  };

  // Função auxiliar para verificar se o nível do curso corresponde aos filtros
  const matchesLevel = (courseLevel) => {
    if (selectedLevels.length === 0) return true;
    
    const levelMap = {
      "Iniciante": ["Iniciante", "Iniciante a Avançado"],
      "Intermediário": ["Intermediário", "Iniciante a Avançado"],
      "Avançado": ["Avançado", "Iniciante a Avançado"]
    };
    
    return selectedLevels.some(selectedLevel => {
      const validLevels = levelMap[selectedLevel] || [];
      return validLevels.includes(courseLevel);
    });
  };

  // Função auxiliar para verificar se o preço corresponde aos filtros
  const matchesPrice = (coursePrice) => {
    if (selectedPrices.length === 0) return true;
    
    const price = extractPrice(coursePrice);
    
    return selectedPrices.some(priceFilter => {
      if (priceFilter === "Gratuito") return price === 0;
      if (priceFilter === "Até R$ 29,90") return price > 0 && price <= 29.90;
      if (priceFilter === "R$ 30 - R$ 49,90") return price >= 30 && price <= 49.90;
      return true;
    });
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = searchTerm === "" || 
                          course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                           course.categories.some(cat => selectedCategories.includes(cat));
    
    const matchesLevelFilter = matchesLevel(course.level);
    const matchesPriceFilter = matchesPrice(course.price);
    
    return matchesSearch && matchesCategory && matchesLevelFilter && matchesPriceFilter;
  });

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleLevelToggle = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const handlePriceToggle = (price) => {
    if (selectedPrices.includes(price)) {
      setSelectedPrices(selectedPrices.filter(p => p !== price));
    } else {
      setSelectedPrices([...selectedPrices, price]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedPrices([]);
    setSearchTerm("");
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedLevels.length > 0 || 
                          selectedPrices.length > 0 || 
                          searchTerm !== "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-heading mb-3">Cursos com Certificação</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Desenvolva suas habilidades profissionais com nossos cursos certificados a preços acessíveis e aumente suas chances de conquistar a vaga dos seus sonhos.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Buscar cursos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Categorias</h3>
              <div className="space-y-2 max-h-96 overflow-auto">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={category} 
                      className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <label htmlFor={category} className="text-sm text-gray-700 dark:text-gray-300">{category}</label>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Nível</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="beginner" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedLevels.includes("Iniciante")}
                    onChange={() => handleLevelToggle("Iniciante")}
                  />
                  <label htmlFor="beginner" className="text-sm text-gray-700 dark:text-gray-300">Iniciante</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="intermediate" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedLevels.includes("Intermediário")}
                    onChange={() => handleLevelToggle("Intermediário")}
                  />
                  <label htmlFor="intermediate" className="text-sm text-gray-700 dark:text-gray-300">Intermediário</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="advanced" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedLevels.includes("Avançado")}
                    onChange={() => handleLevelToggle("Avançado")}
                  />
                  <label htmlFor="advanced" className="text-sm text-gray-700 dark:text-gray-300">Avançado</label>
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Preço</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="free" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedPrices.includes("Gratuito")}
                    onChange={() => handlePriceToggle("Gratuito")}
                  />
                  <label htmlFor="free" className="text-sm text-gray-700 dark:text-gray-300">Gratuito</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="low-price" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedPrices.includes("Até R$ 29,90")}
                    onChange={() => handlePriceToggle("Até R$ 29,90")}
                  />
                  <label htmlFor="low-price" className="text-sm text-gray-700 dark:text-gray-300">Até R$ 29,90</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mid-price" 
                    className="rounded text-brand-600 focus:ring-brand-500 mr-2"
                    checked={selectedPrices.includes("R$ 30 - R$ 49,90")}
                    onChange={() => handlePriceToggle("R$ 30 - R$ 49,90")}
                  />
                  <label htmlFor="mid-price" className="text-sm text-gray-700 dark:text-gray-300">R$ 30 - R$ 49,90</label>
                </div>
              </div>

              {hasActiveFilters && (
                <>
                  <Separator className="my-4" />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearAllFilters}
                  >
                    Limpar Filtros
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Course Listings */}
          <div className="flex-grow">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todos os Cursos</TabsTrigger>
                <TabsTrigger value="popular">Mais Populares</TabsTrigger>
                <TabsTrigger value="recent">Mais Recentes</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum curso encontrado</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termos de busca.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-4">
                {filteredCourses
                  .sort((a, b) => b.rating - a.rating)
                  .length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                      .sort((a, b) => b.rating - a.rating)
                      .map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum curso encontrado</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termos de busca.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="mt-4">
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum curso encontrado</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termos de busca.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-center">
              <Button variant="outline">Carregar Mais Cursos</Button>
            </div>
          </div>
        </div>
      </main>
      
      <section className="bg-brand-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-6 text-gray-900 dark:text-white">Certificações Reconhecidas pelo Mercado</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Todos os nossos cursos incluem certificados reconhecidos por empresas parceiras, com preços acessíveis para impulsionar sua carreira sem comprometer seu orçamento.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Placeholder for partner logos */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg p-4 h-24 flex items-center justify-center shadow-sm">
                <div className="bg-gray-200 dark:bg-gray-600 w-full h-10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Courses;
