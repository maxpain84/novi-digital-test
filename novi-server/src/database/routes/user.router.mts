import { Router } from 'express';
import { User } from '../models/user.model.mjs';

const router = Router();

router.post('/register', async (req: any, res: any) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        user = new User({ firstName, lastName, email, password });
        await user.save();

        req.session.user = user._id; // Save user id in session

        res.status(200).json(user);

    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.userId = user._id;
        req.session.save((err: any) => {
            if (err) {
                console.log('Session save error:', err);
                return res.status(500).send('Session save error');
            }
            console.log('Session saved successfully:', req.session.userId);
            res.status(200).json({ message: 'Logged in successfully', user });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

router.post('/logout', async (req: any, res: any) => {
    await req.session.destroy((err: any) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/checkAuth', async (req: any, res: any) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error in checkAuth:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


router.get('/testSession', (req: any, res: any) => {
    if (req.session._id) {
        res.send(`Session user ID: ${req.session._id}`);
    } else {
        res.send('No session user ID found');
    }
});

export {router};
