import { createRequire } from 'node:module';
import type Mongoose from 'mongoose';

const require = createRequire(import.meta.url);
const mongoose: typeof Mongoose = require('mongoose');

export default mongoose;
export const Schema = mongoose.Schema;
export const model = mongoose.model.bind(mongoose);
export const Types = mongoose.Types;
export const connection = mongoose.connection;
export type { Document } from 'mongoose';
