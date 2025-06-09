import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                backgroundColor: '#222',
                color: '#fff',
                padding: '20px 0',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                }}
            >
                <div style={{ fontSize: '1rem' }}>
                    © {currentYear} TrulyNgl. All rights reserved.
                </div>
                <div
                    style={{
                        marginTop: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '15px',
                        flexWrap: 'wrap',
                    }}
                >
                    <a
                        href="https://www.linkedin.com/in/vaidik-kathal-a22b17298/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#444')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/VaidikKindaCodes"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#444')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.instagram.com/vaidik.06/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#444')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        Instagram
                    </a>
                </div>
                <div
                    style={{
                        marginTop: '10px',
                        fontStyle: 'italic',
                        fontSize: '0.95rem',
                        wordBreak: 'break-word',
                    }}
                >
                    made with love by Vaidik
                </div>
            </div>
            <style>
                {`
                @media (max-width: 600px) {
                    footer div[style] {
                        padding: 0 8px !important;
                    }
                    footer a {
                        font-size: 1rem !important;
                        padding: 8px 8px !important;
                    }
                    footer > div > div {
                        font-size: 0.95rem !important;
                    }
                }
                `}
            </style>
        </footer>
    );
}

export default Footer;