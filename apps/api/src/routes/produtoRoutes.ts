import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';

const router = Router();
const controller = new ProdutoController();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;