package com.gestioneventos.cofira.enums;

public enum DietType {
    OMNIVORE("Omnivoro", "Come todo tipo de alimentos"),
    VEGETARIAN("Vegetariano", "No come carne ni pescado"),
    VEGAN("Vegano", "No consume productos de origen animal"),
    PESCATARIAN("Pescetariano", "Vegetariano que come pescado"),
    KETO("Cetogenica", "Alta en grasas, muy baja en carbohidratos"),
    PALEO("Paleo", "Basada en alimentos no procesados"),
    MEDITERRANEAN("Mediterranea", "Rica en aceite de oliva, pescado y verduras");

    private final String displayName;
    private final String description;

    DietType(String displayName, String description) {
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
