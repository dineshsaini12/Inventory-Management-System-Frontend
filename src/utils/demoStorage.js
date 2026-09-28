import demoSeed from "../data/demoData.json";
export const DEMO_MODE = true;
const STORAGE_KEY = "stockroom-demo-data-v1";
function dateFromToday(offsetDays, includeTime = false) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - offsetDays);
  if (includeTime) return date.toISOString();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function buildInitialData() {
  return {
    ...structuredClone(demoSeed),
    orders: demoSeed.orders.map(({ daysAgo, ...order }) => ({
      ...order,
      date: dateFromToday(daysAgo),
    })),
    purchases: demoSeed.purchases.map(
      ({ daysAgo, expectedDaysFromNow, ...purchase }) => ({
        ...purchase,
        date: dateFromToday(daysAgo),
        expected: dateFromToday(-expectedDaysFromNow),
      }),
    ),
    inventory: demoSeed.inventory.map(({ daysAgo, ...record }) => ({
      ...record,
      date: dateFromToday(daysAgo, true),
    })),
  };
}
export const initialData = buildInitialData();
export function readData() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      const seed = buildInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return {
      ...buildInitialData(),
      ...JSON.parse(storedData),
    };
  } catch (error) {
    console.error("Could not load demo data; using the JSON seed.", error);
    return buildInitialData();
  }
}
export function writeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save demo data.", error);
  }
}
export const getProducts = () => readData().products;
export const saveProducts = (products) =>
  writeData({
    ...readData(),
    products,
  });
export const getStock = () =>
  readData().products.map(({ id, name, sku, stock }) => ({
    id,
    name,
    sku,
    stock,
  }));
export const saveStock = (products) =>
  writeData({
    ...readData(),
    products,
  });
export const getSuppliers = () => readData().suppliers;
export const saveSuppliers = (suppliers) =>
  writeData({
    ...readData(),
    suppliers,
  });
export const getPurchases = () => readData().purchases;
export const savePurchases = (purchases) =>
  writeData({
    ...readData(),
    purchases,
  });
export const getOrders = () => readData().orders;
export const saveOrders = (orders) =>
  writeData({
    ...readData(),
    orders,
  });
export const getInventory = () => readData().inventory;
export const saveInventory = (inventory) =>
  writeData({
    ...readData(),
    inventory,
  });
