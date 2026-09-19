import { getDb, isDbConfigured, toProduct, toProductRow, toSettings } from './_supabase.js';
import { parseBody, send, wrap } from './paypal/_paypal.js';

async function fetchAll(db, table) {
  const { data, error } = await db.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export default wrap(async (req, res) => {
  if (!isDbConfigured()) {
    return send(res, 501, { ok: false, code: 'NO_DB', message: 'Supabase is not configured.' });
  }

  const db = getDb();

  if (req.method === 'GET') {
    try {
      const [productRows, categoryRows, settingRows] = await Promise.all([
        fetchAll(db, 'products'),
        fetchAll(db, 'categories'),
        fetchAll(db, 'settings'),
      ]);
      const products = productRows.map(toProduct);
      const categories = categoryRows.map((c) => c.name).sort();
      const settingsRow = settingRows.find((s) => s.key === 'global');
      return send(res, 200, {
        ok: true,
        products,
        categories,
        settings: toSettings(settingsRow || null),
      });
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    const { action } = body;
    try {
      if (action === 'sync') {
        const products = Array.isArray(body.products) ? body.products : [];
        const categories = Array.isArray(body.categories) ? body.categories : [];

        if (products.length > 0) {
          const { error: upsertError } = await db
            .from('products')
            .upsert(products.map(toProductRow));
          if (upsertError) throw upsertError;
        }

        const { data: existingProducts, error: listError } = await db.from('products').select('id');
        if (listError) throw listError;
        const keepIds = new Set(products.map((p) => p.id));
        const stale = (existingProducts || [])
          .map((p) => p.id)
          .filter((id) => !keepIds.has(id));
        if (stale.length > 0) {
          const { error: deleteError } = await db.from('products').delete().in('id', stale);
          if (deleteError) throw deleteError;
        }

        if (categories.length > 0) {
          const { error: catUpsertError } = await db
            .from('categories')
            .upsert(categories.map((name) => ({ name })));
          if (catUpsertError) throw catUpsertError;
        }

        const { data: existingCategories, error: catListError } = await db
          .from('categories')
          .select('name');
        if (catListError) throw catListError;
        const keepCats = new Set(categories);
        const staleCats = (existingCategories || [])
          .map((c) => c.name)
          .filter((name) => !keepCats.has(name));
        if (staleCats.length > 0) {
          const { error: catDeleteError } = await db
            .from('categories')
            .delete()
            .in('name', staleCats);
          if (catDeleteError) throw catDeleteError;
        }

        return send(res, 200, { ok: true, synchronized: true });
      }

      if (action === 'syncSettings') {
        const settings = body.settings || {};
        const { error } = await db
          .from('settings')
          .upsert({
            key: 'global',
            link_preview_title: settings.linkPreviewTitle || '',
            link_preview_description: settings.linkPreviewDescription || '',
          });
        if (error) throw error;
        return send(res, 200, { ok: true, synchronized: true });
      }

      return send(res, 400, { ok: false, message: `Unknown action "${action}".` });
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  return send(res, 405, { ok: false, message: 'Method not allowed.' });
});