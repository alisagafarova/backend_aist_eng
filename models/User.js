import mongoose from 'mongoose';

// Router interface schema
const InterfaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, default: '' },
  status: { type: String, default: 'shutdown' },
});

// Router schema
const RouterSchema = new mongoose.Schema({
  output: { type: [String], default: [] },
  commandHistory: { type: [String], default: [] },
  historyIndex: { type: Number, default: -1 },
  routes: { type: [String], default: [] },
  interfaces: { type: [InterfaceSchema], default: [] },
  connectedRoutes: {
    type: [
      {
        network: { type: String, required: true },
        iface: { type: String, required: true },
      },
    ],
    default: [],
  },
  isGlobalConfigMode: { type: Boolean, default: false },
  isInterfaceConfigMode: { type: Boolean, default: false },
  currentInterface: { type: InterfaceSchema, default: null },
});

// Task schema
const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true }, // Task description
  requiredStrings: { type: [String], default: [] }, // Necessary strings
  routers: {
    type: Map, // Router map
    of: new mongoose.Schema({
      requiredStrings: { type: [String], default: [] }, // Strings for each router
    }),
    default: {},
  },
  isCompleted: { type: Boolean, default: false }, // Completion status
});

// Lab schema
const LabSchema = new mongoose.Schema({
  labId: { type: String, required: true },
  routers: {
    type: Map, // Routers are stored in a Map
    of: RouterSchema,
    default: {},
  },
});

// User schema
const UserSchema = new mongoose.Schema({
  tasks: { type: Map, of: TaskSchema, default: {} },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  labs: {
    type: [LabSchema], // Array of labs
    default: [],
  },
  currentContext: {
    currentUser: { type: String, default: null },
    currentLab: { type: String, default: null },
    currentRouter: { type: String, default: null },
    currentTask: { type: String, default: null },
  },
  notifications: { type: String, default: null },
  lastVisitedPath: { type: String, default: '/intro/' },
});

export default mongoose.model('User', UserSchema);
