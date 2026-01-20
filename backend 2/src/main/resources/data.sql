-- ================================================================
-- SEED DATA - COFIRA
-- Datos iniciales para alimentos espanoles
-- ================================================================

-- ================================================================
-- ALIMENTOS - Proteinas
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Pollo a la plancha'),
       ('Pechuga de pavo'),
       ('Salmon'),
       ('Merluza'),
       ('Atun'),
       ('Ternera magra'),
       ('Cerdo lomo'),
       ('Huevos'),
       ('Tofu'),
       ('Tempeh'),
       ('Seitan'),
       ('Gambas'),
       ('Pulpo'),
       ('Calamares'),
       ('Bacalao'),
       ('Lubina'),
       ('Dorada'),
       ('Sardinas'),
       ('Anchoas'),
       ('Jamon serrano'),
       ('Pavo'),
       ('Conejo'),
       ('Cordero'),
       ('Claras de huevo') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Carbohidratos
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Arroz integral'),
       ('Arroz blanco'),
       ('Pasta integral'),
       ('Pasta'),
       ('Patata'),
       ('Boniato'),
       ('Quinoa'),
       ('Avena'),
       ('Pan integral'),
       ('Pan blanco'),
       ('Lentejas'),
       ('Garbanzos'),
       ('Judias blancas'),
       ('Judias pintas'),
       ('Cuscus'),
       ('Bulgur'),
       ('Trigo sarraceno'),
       ('Maiz'),
       ('Tortitas de arroz'),
       ('Cereales integrales') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Verduras
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Brocoli'),
       ('Espinacas'),
       ('Calabacin'),
       ('Berenjena'),
       ('Pimiento rojo'),
       ('Pimiento verde'),
       ('Tomate'),
       ('Cebolla'),
       ('Ajo'),
       ('Zanahoria'),
       ('Judias verdes'),
       ('Coliflor'),
       ('Lechuga'),
       ('Pepino'),
       ('Champinones'),
       ('Esparragos'),
       ('Alcachofas'),
       ('Col'),
       ('Lombarda'),
       ('Acelgas'),
       ('Apio'),
       ('Puerro'),
       ('Repollo'),
       ('Rucula'),
       ('Canonigos'),
       ('Endivias') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Frutas
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Manzana'),
       ('Platano'),
       ('Naranja'),
       ('Fresas'),
       ('Arandanos'),
       ('Melocoton'),
       ('Pera'),
       ('Sandia'),
       ('Melon'),
       ('Uvas'),
       ('Kiwi'),
       ('Mango'),
       ('Pina'),
       ('Papaya'),
       ('Granada'),
       ('Cerezas'),
       ('Ciruelas'),
       ('Higos'),
       ('Mandarina'),
       ('Limon'),
       ('Pomelo') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Lacteos
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Yogur natural'),
       ('Yogur griego'),
       ('Queso fresco'),
       ('Leche'),
       ('Leche desnatada'),
       ('Queso cottage'),
       ('Kefir'),
       ('Requesón'),
       ('Queso manchego'),
       ('Queso de cabra'),
       ('Mozzarella'),
       ('Leche de almendras'),
       ('Leche de avena'),
       ('Leche de soja'),
       ('Yogur de soja') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Grasas saludables
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Aceite de oliva virgen extra'),
       ('Aguacate'),
       ('Almendras'),
       ('Nueces'),
       ('Semillas de chia'),
       ('Semillas de lino'),
       ('Mantequilla de cacahuete'),
       ('Mantequilla de almendras'),
       ('Pistachos'),
       ('Anacardos'),
       ('Avellanas'),
       ('Semillas de girasol'),
       ('Semillas de calabaza'),
       ('Aceitunas'),
       ('Tahini') ON CONFLICT DO NOTHING;

-- ================================================================
-- ALIMENTOS - Platos tipicos espanoles
-- ================================================================
INSERT INTO alimento (nombre)
VALUES ('Tortilla espanola'),
       ('Gazpacho'),
       ('Paella'),
       ('Cocido madrileno'),
       ('Fabada asturiana'),
       ('Pisto manchego'),
       ('Salmorejo'),
       ('Escalivada'),
       ('Tumbet'),
       ('Migas'),
       ('Pimientos del padron'),
       ('Revuelto de setas'),
       ('Ensalada mixta'),
       ('Ensalada mediterranea') ON CONFLICT DO NOTHING;
