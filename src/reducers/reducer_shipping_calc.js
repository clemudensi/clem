import { FETCH_SHIPPING_CALC} from "../actions/types";

export default ( state = [], action ) => {
  switch (action.type) {
    case FETCH_SHIPPING_CALC:
      return action.shipping_calc;
    default:
      return state
  }
}
