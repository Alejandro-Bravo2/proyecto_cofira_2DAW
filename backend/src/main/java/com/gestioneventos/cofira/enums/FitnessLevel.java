package com.gestioneventos.cofira.enums;

public enum FitnessLevel {
    SEDENTARY("Sedentario", "Sin experiencia en ejercicio fisico"),
    NOVICE("Principiante", "Menos de 6 meses de experiencia"),
    INTERMEDIATE("Intermedio", "6 meses a 2 anios de experiencia"),
    ADVANCED("Avanzado", "2 a 5 anios de experiencia constante"),
    ATHLETE("Atleta", "Mas de 5 anios o nivel competitivo");

    private final String displayName;
    private final String description;

    FitnessLevel(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
