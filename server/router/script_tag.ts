import Router from 'koa-router';
import Koa from 'koa';

import {
  createScriptTag,
  deleteScriptTagById,
  getAllScriptTags,
} from '../controllers/script_tag_controller';

const router = new Router({ prefix: '/script_tag' });

// router.get("/", async (ctx: Koa.Context) => {
//   console.log("Get script tag");
//   ctx.body = "Get script tag";
// });

router.get('/all', async (ctx: Koa.Context) => {
  console.log('Get script tags');
  const result =
    (await getAllScriptTags(ctx.myClient, 'https://google.com/')) ?? [];
  ctx.body = {
    installed: result.length > 0,
    details: result,
  };
});

router.post('/', async (ctx: Koa.Context) => {
  console.log('Create a script tag');
  const result = await createScriptTag(ctx.myClient);
  ctx.body = result;
});

router.delete('/', async (ctx: Koa.Context) => {
  console.log('Delete a script tag');
  const id = ctx.query.id;
  const result = await deleteScriptTagById(
    ctx.myClient,
    typeof id === 'string' ? id : id[0],
  );
  ctx.body = result;
});

export default router;
