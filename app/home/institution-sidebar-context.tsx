"use client";

import React from "react";

type InstitutionSidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const InstitutionSidebarContext =
  React.createContext<InstitutionSidebarContextValue | null>(null);

export function InstitutionSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <InstitutionSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </InstitutionSidebarContext.Provider>
  );
}

export function useInstitutionSidebar() {
  const ctx = React.useContext(InstitutionSidebarContext);
  if (!ctx) throw new Error("useInstitutionSidebar used without provider");
  return ctx;
}
