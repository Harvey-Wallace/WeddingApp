import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const { answers, timestamp } = await req.json();

    // Set up Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: 'stoked-coder-444612-t7',
        private_key_id: '6a1e3a5705e3afc64a810ca28d928ade1acee266',
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: '102238187633911240652',
        universe_domain: 'googleapis.com'
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Format the answers for the spreadsheet
    const rowData = formatAnswersForSheets(answers, timestamp);

    // Append the row to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:Y', // Adjust if your sheet has a different name
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('Quiz submission saved to Google Sheets:', {
      timestamp,
      answerCount: Object.keys(answers).length
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Quiz submitted successfully!' 
    });

  } catch (error) {
    console.error('Error submitting quiz to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

// Helper function to format answers for Google Sheets
function formatAnswersForSheets(answers: Record<string, string>, timestamp: string) {
  const row = [timestamp];
  
  // Add answers in order (Round 1, Round 2, Round 3)
  // You can customize this based on your spreadsheet structure
  const orderedAnswers = [];
  
  // Round 1 questions (10 questions)
  for (let i = 0; i < 10; i++) {
    orderedAnswers.push(answers[`round_0_q_${i}`] || '');
  }
  
  // Round 2 questions (8 questions)
  for (let i = 0; i < 8; i++) {
    orderedAnswers.push(answers[`round_1_q_${i}`] || '');
  }
  
  // Round 3 questions (6 questions)
  for (let i = 0; i < 6; i++) {
    orderedAnswers.push(answers[`round_2_q_${i}`] || '');
  }
  
  return [...row, ...orderedAnswers];
}
