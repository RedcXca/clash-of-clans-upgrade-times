import resourceData from "./data/resource.json";
import armyData from "./data/army.json";
import defenseData from "./data/defense.json";
import trapData from "./data/trap.json";
import troopData from "./data/troop.json";
import spellData from "./data/spell.json";
import siegeData from "./data/siege.json";
import heroData from "./data/hero.json";
import petData from "./data/pet.json";

export interface Upgrade {
  level: number;
  cost: number;
  currency: string;
  time: number;
  townhall: number;
}

export interface Item {
  name: string;
  upgrades: Upgrade[];
}

export interface Category {
  name: string;
  items: Item[];
}

export interface TableRow {
  category: string;
  name: string;
  level: number;
  cost: number;
  currency: string;
  time: number;
  townhall: number;
}

const data: Record<string, Record<string, Upgrade[]>> = {
  Resource: resourceData,
  Army: armyData,
  Defense: defenseData,
  Trap: trapData,
  Troop: troopData,
  Spell: spellData,
  Siege: siegeData,
  Hero: heroData,
  Pet: petData,
};

export function getCategories(): Category[] {
  return Object.entries(data).map(([categoryName, items]) => ({
    name: categoryName,
    items: Object.entries(items).map(([itemName, upgrades]) => ({
      name: itemName,
      upgrades: upgrades,
    })),
  }));
}

export function getFormattedTableData(): TableRow[] {
  const formattedData: TableRow[] = [];

  Object.entries(data).forEach(([category, items]) => {
    Object.entries(items).forEach(([name, upgrades]) => {
      upgrades.forEach((upgrade) => {
        formattedData.push({
          category,
          name,
          ...upgrade,
        });
      });
    });
  });

  return formattedData;
}
