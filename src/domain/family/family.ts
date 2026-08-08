export type FamilyId = string & { readonly __brand: 'FamilyId' };
export type ParentUserId = string & { readonly __brand: 'ParentUserId' };
export type ChildProfileId = string & { readonly __brand: 'ChildProfileId' };

export type FamilyRole = 'OWNER' | 'GUARDIAN';

export type Family = Readonly<{
  id: FamilyId;
  createdAt: string;
}>;

export type FamilyMembership = Readonly<{
  familyId: FamilyId;
  userId: ParentUserId;
  role: FamilyRole;
  createdAt: string;
}>;

export type ChildProfile = Readonly<{
  id: ChildProfileId;
  familyId: FamilyId;
  displayName: string;
  developmentalStage: 'SEED' | 'SPROUT' | 'EXPLORER' | 'CREATOR';
  homeLocale: string;
  learningLocale: string;
  createdAt: string;
}>;

export type ActiveChildContext = Readonly<{
  family: Family;
  child: ChildProfile;
}>;
