import express from 'express';

const router = express.Router();
// doesn't have to be async like signin (not doing error handling...)
router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
