import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';
import { sendEmail } from '../sendEmail.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя по email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid login or password' });
    }

    // Генерируем JWT-токен
    const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });

    res.json({
      token,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      labs: user.labs, // Отправляем лаборатории
      currentContext: user.currentContext || {},
      notifications: user.notifications || null,
      lastVisitedPath: user.lastVisitedPath,
      tasks: user.tasks,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Authorization failed' });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Хэшируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tasks = new Map(
      Object.entries({
        'interface-config': {
          description: 'Interface Configuration',
          requiredStrings: ['GigabitEthernet 0/0', '10.2.2.1 255.255.255.0', 'no shutdown'],
          isTaskCompleted: false,
        },
        'static-route': {
          description: 'Static Route Configuration',
          requiredStrings: ['192.168.1.0/24 [1/0] via 10.2.2.2'],
          isTaskCompleted: false,
        },
        'network-config': {
          description: 'Network Configuration',
          routers: new Map([
            [
              'R1',
              {
                requiredStrings: [
                  'GigabitEthernet 0/0',
                  '10.2.2.1 255.255.255.0',
                  'no shutdown',
                  '192.168.1.0/24 [1/0] via 10.2.2.2',
                ],
              },
            ],
            [
              'R2',
              { requiredStrings: ['GigabitEthernet 0/1', '10.2.2.2 255.255.255.0', 'no shutdown'] },
            ],
          ]),
          isTaskCompleted: false,
        },
      }),
    );

    // Создаем нового пользователя
    const newUser = new UserModel({
      fullName,
      email,
      passwordHash: hashedPassword,
      tasks,
      labs: [
        {
          labId: 'lab1',
          routers: {
            R1: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                { name: 'GigabitEthernet 0/0', ip: '', status: 'shutdown' },
                { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
              ],
              connectedRoutes: [],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
            R2: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                { name: 'GigabitEthernet 0/1', ip: '', status: 'shutdown' },
                { name: 'GigabitEthernet 1/0', ip: '', status: 'shutdown' },
              ],
              connectedRoutes: [{ network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' }],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
          },
        },
        {
          labId: 'lab2',
          routers: {
            R1: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                {
                  name: 'GigabitEthernet 0/0',
                  ip: '10.2.2.1 255.255.255.0',
                  status: 'no shutdown',
                },
                { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
              ],
              connectedRoutes: [{ network: '10.2.2.0/24', iface: 'GigabitEthernet 0/0' }],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
            R2: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                {
                  name: 'GigabitEthernet 0/1',
                  ip: '10.2.2.2 255.255.255.0',
                  status: 'no shutdown',
                },
                {
                  name: 'GigabitEthernet 1/0',
                  ip: '192.168.1.1 255.255.255.0',
                  status: 'no shutdown',
                },
              ],
              connectedRoutes: [
                { network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' },
                { network: '10.2.2.0/24', iface: 'GigabitEthernet 0/1' },
              ],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
          },
        },
        {
          labId: 'lab3',
          routers: {
            R1: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                { name: 'GigabitEthernet 0/0', ip: '', status: 'shutdown' },
                { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
              ],
              connectedRoutes: [],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
            R2: {
              output: [],
              commandHistory: [],
              historyIndex: -1,
              routes: [],
              interfaces: [
                { name: 'GigabitEthernet 0/1', ip: '', status: 'shutdown' },
                {
                  name: 'GigabitEthernet 1/0',
                  ip: '192.168.1.1 255.255.255.0',
                  status: 'no shutdown',
                },
              ],
              connectedRoutes: [{ network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' }],
              isGlobalConfigMode: false,
              isInterfaceConfigMode: false,
              currentInterface: null,
            },
          },
        },
      ],
      currentContext: {
        currentLab: 'lab1',
        currentRouter: 'R1',
        currentTask: 'interface-config',
      },
    });

    const savedUser = await newUser.save();

    // Генерируем JWT-токен
    const token = jwt.sign({ _id: savedUser._id }, 'secret123', { expiresIn: '30d' });

    res.json({
      token,
      _id: savedUser._id,
      tasks: savedUser.tasks,
      fullName: savedUser.fullName,
      email: savedUser.email,
      labs: savedUser.labs,
      currentContext: savedUser.currentContext,
      notifications: savedUser.notifications || null,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Создаем JWT для сброса пароля
    const token = jwt.sign({ _id: user._id }, 'reset_secret', { expiresIn: '1h' });
    const resetLink = `https://aist-hal4q7n4d-alisagafarovas-projects.vercel.app/reset-password?token=${token}`;

    // Отправляем письмо с Gmail API
    const subject = 'Password Reset Request';
    const htmlContent = `
    Password Reset

    To reset your password, click the link below:

    [Click here to reset your password](${resetLink})

    ---

    If you did not request a password reset, please ignore this email.

    Best regards,
    The AIST Platform Team
`;
    // Вызов функции для отправки письма
    await sendEmail(email, subject, htmlContent);

    res.json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request.' });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Проверяем токен
    const decoded = jwt.verify(token, 'reset_secret');
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Хэшируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Обновляем пароль в базе данных
    user.passwordHash = hash;
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password. Ensure token is valid.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Преобразуем Map в обычный объект
    const userData = {
      ...user._doc,
      labs: Object.fromEntries(
        Object.entries(user.labs).map(([labKey, labValue]) => ({
          [labKey]: {
            ...labValue,
            routers: labValue.routers ? Object.fromEntries(labValue.routers) : {},
          },
        })),
      ),
    };

    res.json(userData);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'No access' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = user.progress ? Object.fromEntries(user.progress) : {};
    res.json(progress);
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
};

export const saveProgress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    const { labId, progressData, currentContext, tasks } = req.body;

    if (!labId || !progressData) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    // Find user and update progress

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const lab = user.labs.find((lab) => lab.labId === labId);

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    if (currentContext) {
      user.currentContext = {
        ...user.currentContext,
        ...currentContext,
      };
    }

    // Update tasks and routers
    if (tasks) {
      const updatedTasks = new Map([
        ...Array.from(user.tasks.entries()), // Existing tasks
        ...Object.entries(tasks), // New tasks
      ]);
      user.tasks = updatedTasks;
    }

    if (progressData.routers) {
      lab.routers = new Map([...lab.routers, ...Object.entries(progressData.routers)]);
    }

    // Сохранить изменения
    await user.save();

    res.json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ message: 'Failed to save progress' });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { userId, labId, progress, currentContext } = req.body;

    // Searching for user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Searching for lab by ID
    const lab = user.labs.find((lab) => lab.labId === labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Update of lab
    lab.tasks = { ...lab.tasks, ...progress.tasks };

    // Updating currentContext if provided
    if (currentContext) {
      user.currentContext = {
        ...user.currentContext,
        ...currentContext,
      };
    }

    // Saving changes to the database
    await user.save();

    res.json({ message: 'Progress and context updated', lab, currentContext: user.currentContext });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update progress and context' });
  }
};

export const updateLastVisitedPath = async (req, res) => {
  try {
    const userId = req.userId; // Current user ID (from token)
    const { lastVisitedPath } = req.body;

    if (!lastVisitedPath) {
      return res.status(400).json({ message: 'Path is required' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastVisitedPath = lastVisitedPath;
    await user.save();

    res.json({ message: 'Last visited path updated successfully' });
  } catch (error) {
    console.error('Error updating last visited path:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
