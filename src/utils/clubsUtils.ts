import { Club } from "@/types/types";

export const getActiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "ACTIVE");
};

export const getInactiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "INACTIVE");
};

export const getPendingClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "PENDING");
};

export const getActiveNotApiClubs = (clubs: Club[]) => {
  return getActiveClubs(clubs).filter((c: Club) => !c.APIData);
};
