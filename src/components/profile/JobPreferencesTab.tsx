/**
 * MOVER - Componente de Preferências de Vaga
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, MapPin, Calendar, Briefcase, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface JobPreferences {
  is_looking_for_job: boolean | null;
  preferred_roles: string[];
  preferred_location_types: string[];
  preferred_locations: string[];
  start_date_preference: 'immediate' | 'flexible';
  employment_types: string[];
  visibility: 'recruiters_only' | 'all_users';
}

const JobPreferencesTab = ({ userId }: { userId?: string }) => {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<JobPreferences>({
    is_looking_for_job: null,
    preferred_roles: [],
    preferred_location_types: [],
    preferred_locations: [],
    start_date_preference: 'flexible',
    employment_types: [],
    visibility: 'recruiters_only',
  });

  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Carregar preferências do perfil
  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('job_preferences')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao carregar preferências:', error);
          return;
        }

        if (data?.job_preferences) {
          setPreferences(prev => ({
            ...prev,
            ...data.job_preferences,
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };

    loadPreferences();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ job_preferences: preferences })
        .eq('id', userId);

      if (error) throw error;

      await refreshProfile();
      toast.success('Preferências salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addRole = () => {
    if (newRole.trim() && !preferences.preferred_roles.includes(newRole.trim())) {
      setPreferences({
        ...preferences,
        preferred_roles: [...preferences.preferred_roles, newRole.trim()],
      });
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setPreferences({
      ...preferences,
      preferred_roles: preferences.preferred_roles.filter(r => r !== role),
    });
  };

  const addLocation = () => {
    if (newLocation.trim() && !preferences.preferred_locations.includes(newLocation.trim())) {
      setPreferences({
        ...preferences,
        preferred_locations: [...preferences.preferred_locations, newLocation.trim()],
      });
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setPreferences({
      ...preferences,
      preferred_locations: preferences.preferred_locations.filter(l => l !== location),
    });
  };

  const toggleLocationType = (type: string) => {
    const current = preferences.preferred_location_types;
    if (current.includes(type)) {
      setPreferences({
        ...preferences,
        preferred_location_types: current.filter(t => t !== type),
      });
    } else {
      setPreferences({
        ...preferences,
        preferred_location_types: [...current, type],
      });
    }
  };

  const toggleEmploymentType = (type: string) => {
    const current = preferences.employment_types;
    if (current.includes(type)) {
      setPreferences({
        ...preferences,
        employment_types: current.filter(t => t !== type),
      });
    } else {
      setPreferences({
        ...preferences,
        employment_types: [...current, type],
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Preferências de Vaga</CardTitle>
          <CardDescription>
            Configure suas preferências para receber as melhores oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cargos */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Cargos* <span className="text-xs text-gray-500">(Obrigatório)</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {preferences.preferred_roles.map((role) => (
                <Badge key={role} variant="default" className="flex items-center gap-1">
                  {role}
                  <button
                    onClick={() => removeRole(role)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    aria-label={`Remover ${role}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Desenvolvedor, Analista, Gerente..."
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRole()}
              />
              <Button onClick={addRole} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tipos de Localidade */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Tipos de localidade* <span className="text-xs text-gray-500">(Obrigatório)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {['Presencial', 'Remoto', 'Híbrido'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={preferences.preferred_location_types.includes(type.toLowerCase()) ? 'default' : 'outline'}
                  onClick={() => toggleLocationType(type.toLowerCase())}
                  className="capitalize"
                >
                  {preferences.preferred_location_types.includes(type.toLowerCase()) && (
                    <span className="mr-1">✓</span>
                  )}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Localidades Presenciais */}
          {preferences.preferred_location_types.includes('presencial') && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Localidades (presenciais)* <span className="text-xs text-gray-500">(Obrigatório)</span>
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {preferences.preferred_locations.map((location) => (
                  <Badge key={location} variant="default" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <button
                      onClick={() => removeLocation(location)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      aria-label={`Remover ${location}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Manaus, Amazonas, Brasil"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                />
                <Button onClick={addLocation} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Data de Início */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Data de início</Label>
            <RadioGroup
              value={preferences.start_date_preference}
              onValueChange={(value: 'immediate' | 'flexible') =>
                setPreferences({ ...preferences, start_date_preference: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="font-normal cursor-pointer">
                  Imediatamente, estou me candidatando agora
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="font-normal cursor-pointer">
                  Flexível, estou apenas conferindo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tipos de Emprego */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tipos de emprego</Label>
            <div className="flex flex-wrap gap-2">
              {['Tempo integral', 'Meio período', 'Contrato', 'Estágio', 'Temporário'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={preferences.employment_types.includes(type) ? 'default' : 'outline'}
                  onClick={() => toggleEmploymentType(type)}
                >
                  {preferences.employment_types.includes(type) && (
                    <span className="mr-1">✓</span>
                  )}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Visibilidade */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Visibilidade (quem pode ver que você está buscando emprego)*
            </Label>
            <RadioGroup
              value={preferences.visibility}
              onValueChange={(value: 'recruiters_only' | 'all_users') =>
                setPreferences({ ...preferences, visibility: value })
              }
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="recruiters_only" id="recruiters_only" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="recruiters_only" className="font-normal cursor-pointer">
                      Apenas recrutadores
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Apenas os que usam o LinkedIn Recruiter
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tomamos medidas para não exibir seu interesse a recrutadores da sua empresa atual, mas não podemos garantir privacidade total.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="all_users" id="all_users" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="all_users" className="font-normal cursor-pointer">
                      Todos os usuários do LinkedIn
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Isso inclui recrutadores e funcionários da sua empresa atual
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Esta seleção adiciona o selo #OpenToWork.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setPreferences({
                is_looking_for_job: null,
                preferred_roles: [],
                preferred_location_types: [],
                preferred_locations: [],
                start_date_preference: 'flexible',
                employment_types: [],
                visibility: 'recruiters_only',
              });
            }}>
              Excluir
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPreferencesTab;




