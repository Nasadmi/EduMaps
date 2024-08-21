export interface Markmaps {
  id: number;
  name: string;
  author: string;
  script: string;
  public: string | number;
  stars: number;
  created_at: string;
}

export type MarkmapsHome = Pick<
  Markmaps,
  'name' | 'author' | 'stars' | 'created_at' | 'id'
>;
