import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/database';

interface BudgetAttributes {
  id?: number;
  userId: string;
  orderNumber: string;
  supplierNumber: string;
  documentDate: string;
  deliveryDate: string;
  contractNumber: string;
  capex: number;
  opex: number;
  support: number;
  hourlyRate: number;
  year: number;
}

class Budget extends Model<BudgetAttributes> implements BudgetAttributes {
  public id!: number;
  public userId!: string;
  public orderNumber!: string;
  public supplierNumber!: string;
  public documentDate!: string;
  public deliveryDate!: string;
  public contractNumber!: string;
  public capex!: number;
  public opex!: number;
  public support!: number;
  public hourlyRate!: number;
  public year!: number;
}

Budget.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplierNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capex: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    opex: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    support: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    hourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear(),
    },
  },
  {
    sequelize,
    modelName: 'Budget',
  }
);

export { Budget };
