import Loadable from 'react-loadable';
import {MyLoadingComponent} from '../components/loadingComponent';


const AsyncPageNotFound = Loadable({
  loader: () => import('../views/NotFound/NotFound.jsx') ,
  loading: MyLoadingComponent
});

let indexRoute = [
  {path: '', name: 'Not Found', component: AsyncPageNotFound},
];

export default indexRoute;
