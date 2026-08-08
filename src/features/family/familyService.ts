import { supabase } from '../../infrastructure/supabase/client';

export type ChildProfile = {
  id: string;
  family_id: string;
  display_name: string | null;
  developmental_stage: 'SEED' | 'SPROUT' | 'EXPLORER' | 'CREATOR';
  home_language: string | null;
  learning_language: string | null;
  locale: string | null;
  avatar_key: string;
};

export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id ?? null;
}

export async function listMyChildProfiles(): Promise<ChildProfile[]> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('id,family_id,display_name,developmental_stage,home_language,learning_language,locale,avatar_key')
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ChildProfile[];
}

export async function createFamilyWithFirstChild(input: {
  childDisplayName?: string;
  birthYear?: number;
  birthMonth?: number;
  homeLanguage?: string;
  learningLanguage?: string;
  locale?: string;
}): Promise<ChildProfile> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Parent must be signed in before creating a family.');

  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert({ created_by: userId })
    .select('id')
    .single();
  if (familyError) throw familyError;

  const { error: memberError } = await supabase.from('family_members').insert({
    family_id: family.id,
    user_id: userId,
    role: 'OWNER',
  });
  if (memberError) throw memberError;

  const { data: child, error: childError } = await supabase
    .from('child_profiles')
    .insert({
      family_id: family.id,
      display_name: input.childDisplayName?.trim() || null,
      birth_year: input.birthYear ?? null,
      birth_month: input.birthMonth ?? null,
      developmental_stage: 'SEED',
      home_language: input.homeLanguage ?? null,
      learning_language: input.learningLanguage ?? null,
      locale: input.locale ?? null,
      avatar_key: 'default-child-v1',
    })
    .select('id,family_id,display_name,developmental_stage,home_language,learning_language,locale,avatar_key')
    .single();

  if (childError) throw childError;
  return child as ChildProfile;
}
