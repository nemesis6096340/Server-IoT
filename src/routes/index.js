import { Router } from "express";

import home from "./home.routes.js";
import authentication from "./auth.routes.js";

import facilities from "./facilities.routes.js";
import production from "./production.routes.js";

/*import index from "./index.routes";
import links from "./links.routes";
import user from "./user.routes";
*/
const router = Router();
router.use(home);
router.use(authentication);
router.use(facilities);
router.use(production);


/*router.use(index);

router.use(auth);
router.use(user);
router.use("/links", links);
*/
export default router;
