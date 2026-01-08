package com.gestioneventos.cofira.enums;

public enum TrainingLocation {
    HOME("Casa", "Entreno en casa con equipamiento basico"),
    GYM("Gimnasio", "Entreno en gimnasio con equipamiento completo"),
    OUTDOOR("Aire libre", "Entreno al aire libre (parques, calle)"),
    MIXED("Mixto", "Combino diferentes lugares de entrenamiento");

    private final String displayName;
    private final String description;

    TrainingLocation(String displayName, String description) {
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
