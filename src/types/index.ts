export type Astronaut = {
  id: number;
  name: string;
  surname: string;
  birthdate: string;
  superpowers: Superpower[];
  createdAt: string;
  updatedAt: string;
};

export type Superpower = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};
