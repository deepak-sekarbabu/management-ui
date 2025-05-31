import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useAuth } from 'src/components/AuthProvider';

// ----------------------------------------------------------------------

export default function LoginView() {

    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(email, password);
        if (result.success) {
            router.push('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const renderForm = (
        <form onSubmit={handleLogin}>
            <Stack spacing={3} sx={{ mb: 1 }}>
                <TextField
                    name="email"
                    label="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="medium"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                        },
                    }}
                />
                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    size="medium"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                >
                                    <Iconify
                                        icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                        sx={{ width: 20, height: 20 }}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            {error && (
                <Typography 
                    color="error" 
                    variant="body2" 
                    sx={{ 
                        mt: 1,
                        mb: 2,
                        textAlign: 'center',
                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                        p: 1,
                        borderRadius: 1,
                    }}
                >
                    {error}
                </Typography>
            )}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <div /> {/* Empty div for flex spacing */}
                <Link 
                    variant="caption" 
                    underline="hover"
                    sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    Forgot password?
                </Link>
            </Stack>
            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    height: 48,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: (theme) => theme.customShadows.z8,
                    },
                }}
                loading={loading}
            >
                Login
            </LoadingButton>
        </form>
    );

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: (theme) => alpha(theme.palette.background.default, 0.9),
                    imgUrl: '/assets/background/overlay_4.jpg',
                }),
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 3,
            }}
        >
            <Logo
                sx={{
                    position: 'fixed',
                    top: { xs: 16, md: 24 },
                    left: { xs: 16, md: 24 },
                                    }}
            />
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    py: { xs: 8, md: 12 },
                }}
            >
                <Card
                    sx={{
                        p: { xs: 3, sm: 5 },
                        width: 1,
                        maxWidth: 440,
                        borderRadius: 2,
                        boxShadow: (theme) => theme.customShadows.z24,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Sign in to your Clinic Management account
                        </Typography>
                    </Box>

                    {renderForm}
                    
                    <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                        Don&apos;t have an account?{' '}
                        <Link 
                            href="#" 
                            variant="subtitle2" 
                            sx={{ 
                                ml: 0.5,
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Get started
                        </Link>
                    </Typography>
                </Card>
            </Box>
        </Box>
    );
}
