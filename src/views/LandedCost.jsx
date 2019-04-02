import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {bindActionCreators} from "redux";
import fetchShippingCalc from "../actions/landedCost";
import connect from "react-redux/es/connect/connect";
import {destination, origin} from '../constants/origin-destination'
import {goodsType} from '../constants/goodsType';
import {weightUnits} from '../constants/weightUnits';
import {truckShippingCost} from "../helpers/truckShippingCost";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

class LandedCost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: 'ghana',
      destination: 'us',
      number: 0,
      weight: 0,
      pricePerCommodity: 0,
      id: '',
      price: 0,
      distanceUnits: '',
      weightUnits: '',
      distanceToPort: 0,
      distanceToBuyer: 0,
      goodsType: 'non perishable',
      percentageVal: 0,
      result: false,
      route: {
        origin: {
          vehicle:[{
            weightLimit: 0,
            capacity: 0,
            pricePerKm: 0,
            name: '',
            vehicleType: ''
          }] },
        destination: {
          vehicle:[{
            weightLimit: 0,
            capacity: 0,
            pricePerKm: 0,
            name: '',
            vehicleType: ''
          }] }}
    }
  }

  componentDidMount = async () => {
    const { origin, destination } = this.state;
    await this.props.fetchShippingCalc( origin, destination);
    this.setState({ route: this.props.shipping_calc });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    try{
      const {origin, destination} = this.state;
      if (prevState.origin !== this.state.origin || prevState.destination !== this.state.destination){
        await this.props.fetchShippingCalc( origin, destination);
        this.setState({ route: this.props.shipping_calc });
      }
    }catch (error) {
      return error
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onClickResult = () => {
    this.setState({result: true});
  };

  commodityPrice() {
    return this.state.pricePerCommodity * this.state.number
  }

  transportToPort() {

    const {route, distanceToPort, weight, goodsType} = this.state;
    return truckShippingCost( route.origin.vehicle, goodsType, distanceToPort, weight)
  }

  originFuelSurcharge() {
    return 0.05 * this.transportToPort()
  }

  exportDuties() {
    return 0.03 * this.commodityPrice() + 200
  }

  originExcessFee() {
    const {number} = this.state;
    if (number < 20000) return 0;
    if (number > 20000) return ((number - 20000) * 0.5 + 200);
    return  0
  }

  originFreightFee() {
    return 300
  }

  shippingCost() {
    const {weight} = this.state;
    return 1.65 * weight
  }

  cargoInsurance() {
    return 0.05 * this.shippingCost()
  }

  destinationExcessFee() {
    const {number} = this.state;
    if (number < 19500) return 0;
    if (number > 19500) return ((number - 20000) * 0.5 + 180);
    return  0
  }

  destinationFreightFee() {
    return 250
  }

  transportToBuyer() {
    const {route, distanceToBuyer, weight, goodsType} = this.state;
    return truckShippingCost( route.destination.vehicle, goodsType, distanceToBuyer, weight);
  }

  destinationFuelSurchage() {
    return 0.04 * this.transportToBuyer()
  }

  importDuties() {
    return 0.15 * 175
  }

  landedCost = () => {
    const {weightUnits} = this.state;
    try {
      const total = [
        this.commodityPrice(),
        this.transportToPort(),
        this.originFuelSurcharge(),
        this.exportDuties(),
        this.originExcessFee(),
        this.originFreightFee(),
        this.cargoInsurance(),
        this.shippingCost(),
        this.destinationFreightFee(),
        this.destinationExcessFee(),
        this.transportToBuyer(),
        this.destinationFuelSurchage(),
        this.importDuties()
      ];
      // for future adjustment do endeavor to take out the divided by 10
      const landedCost = ((total.reduce((a, b) => a + b, 0)/10) * weightUnits).toFixed(3);
      switch (weightUnits) {
        case 1:
          return `landed cost for this item is $${landedCost} per kg`;
        case 0.4535:
          return `landed cost for this item is $${landedCost} per lbs`;
        case 1000:
          return `landed cost for this item is $${landedCost} per Mt.`;
        default:
          return 0
      }
    } catch (err) {
      return err
    }
  };

  render() {
    const {classes} = this.props;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid item xs={12}>
            <h2 align="center">Landed Cost calculator</h2>
            <br/>
            <TextField
              id="outlined-number"
              label="Number of items"
              value={this.state.number}
              onChange={this.handleChange('number')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Price per Commodity in $"
              value={this.state.pricePerCommodity}
              onChange={this.handleChange('pricePerCommodity')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Weight of item"
              value={this.state.weight}
              onChange={this.handleChange('weight')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Distance to Port in km"
              value={this.state.distanceToPort}
              onChange={this.handleChange('distanceToPort')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-select-origin"
              select
              label="Origin"
              className={classes.textField}
              value={this.state.origin}
              onChange={this.handleChange('origin')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of origin"
              margin="normal"
              variant="outlined"
            >
              {origin.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-destination"
              select
              label="Destination"
              className={classes.textField}
              value={this.state.destination}
              onChange={this.handleChange('destination')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of destination"
              margin="normal"
              variant="outlined"
            >
              {destination.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-number"
              label="Distance to Buyer in km"
              value={this.state.distanceToBuyer}
              onChange={this.handleChange('distanceToBuyer')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />

            <TextField
              id="outlined-select-destination"
              select
              label="Goods Type"
              className={classes.textField}
              value={this.state.goodsType}
              onChange={this.handleChange('goodsType')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of destination"
              margin="normal"
              variant="outlined"
            >
              {goodsType.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-destination"
              select
              label="Weight Unit"
              className={classes.textField}
              value={this.state.weightUnits}
              onChange={this.handleChange('weightUnits')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Select a unit of weight"
              margin="normal"
              variant="outlined"
            >
              {weightUnits.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </form>
        <div>
          <p>{this.state.result ? this.landedCost() : null}</p>
          <br/>
          <button onClick={this.onClickResult}>Landed Cost</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    shipping_calc: state.shipping_calc
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchShippingCalc}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LandedCost));
