import express from 'express';
import {getAllArticle, createArticle, deleteArticle, getArticalById, updateArticle, customerWIseArticle} from '../controllers/articleController.js';

const router = express.Router();

router.post('/', createArticle);
router.get('/', getAllArticle);
router.get('/:id', getArticalById);
router.put('/:id', updateArticle);
router.patch('/:id', deleteArticle);
router.get('/:customerId/articles', customerWIseArticle);

export default router;
