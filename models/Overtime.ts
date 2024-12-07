import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/database';

interface OvertimeAttributes {
  id?: number;
  userId: string;
  month: string; // Format YYYY-MM
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
  isApproved: boolean; // Czy nadgodziny zostały zatwierdzone w rozliczeniu miesięcznym
}

class Overtime extends Model<OvertimeAttributes> implements OvertimeAttributes {
  public id!: number;
  public userId!: string;
  public month!: string;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public incidentNumber!: string;
  public description!: string;
  public duration!: number;
  public isApproved!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Overtime.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    incidentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Overtime',
    indexes: [
      {
        fields: ['userId', 'month']
      }
    ]
  }
);

export { Overtime, type OvertimeAttributes };
