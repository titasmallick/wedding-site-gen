import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import * as admin from 'firebase-admin';
import adminCred from '@/config/firebase-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new ImageResponse(<>No Slug</>, { width: 1200, height: 630 });
  }

  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(adminCred as admin.ServiceAccount),
      });
    } catch (error) {
        console.error('Firebase admin init error', error);
    }
  }

  let guestName = 'Guest';

  try {
    const db = admin.firestore();
    const docSnap = await db.collection('invitation').doc(slug).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      guestName = data?.name || 'Guest';
    }
  } catch (e) {
    console.error('Error fetching guest data:', e);
  }

  // Fetch font
  const fontData = await fetch(
    'https://github.com/google/fonts/blob/main/ofl/greatvibes/GreatVibes-Regular.ttf?raw=true'
  ).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch font');
    return res.arrayBuffer();
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          color: '#ec4899',
        }}
      >
        <div
            style={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
                border: '4px solid #fbcfe8',
                borderRadius: '20px',
                zIndex: 0,
            }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 110, marginBottom: 10, color: '#be185d', fontFamily: '"Great Vibes"' }}>Titas & Sukanya</div>
            <div
                style={{
                    fontSize: 32,
                    fontFamily: 'sans-serif',
                    letterSpacing: '4px',
                    marginBottom: 50,
                    color: '#db2777',
                    fontWeight: 'bold',
                }}
            >
                Wedding Invitation
            </div>

            <div style={{ fontSize: 32, fontFamily: 'sans-serif', marginBottom: 10, color: '#4b5563' }}>Inviting</div>
            <div style={{ fontSize: 80, fontWeight: 'bold', color: '#be185d', textAlign: 'center', fontFamily: 'sans-serif' }}>{guestName}</div>

            <div style={{ marginTop: 40, fontSize: 26, fontFamily: 'sans-serif', color: '#6b7280' }}>Join us as we tie the knot</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Great Vibes',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
