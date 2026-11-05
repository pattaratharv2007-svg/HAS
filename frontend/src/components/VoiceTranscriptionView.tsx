import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Languages, 
  Lock 
} from 'lucide-react';
import { Role, ClinicalVoiceNote } from '../types';

interface VoiceTranscriptionViewProps {
  currentRole: Role;
  clinicianName?: string;
  clinicianId?: number;
  onSaveAndSignOff: (noteId: number, finalText: string, confirmed: boolean) => Promise<void>;
}

export const VoiceTranscriptionView: React.FC<VoiceTranscriptionViewProps> = ({
  currentRole,
  clinicianName = 'Dr. Priya Sharma',
  clinicianId = 1,
  onSaveAndSignOff,
}) => {
  const [activeTab, setActiveTab] = useState<'Doctor' | 'Nurse'>(currentRole === 'NURSE' ? 'Nurse' : 'Doctor');
  const [language, setLanguage] = useState('English');
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [patientRef, setPatientRef] = useState('PT-CARD-8821');

  // Preview / Editor State
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'structured' | 'full'>('structured');
  const [isAiDraft, setIsAiDraft] = useState(true);

  // Structured Draft Fields
  const [assessmentNotes, setAssessmentNotes] = useState(
    'Patient presents with acute substernal chest pressure radiating to left arm and jaw. Mild diaphoresis and shortness of breath upon exertion. Vitals: BP 142/88, HR 92 bpm, SpO2 96% on room air.'
  );
  const [procedureInfo, setProcedureInfo] = useState(
    '12-lead ECG confirmed acute ST-elevation in inferior leads (II, III, aVF). Immediate activation of cardiac cath team required.'
  );
  const [treatmentInstructions, setTreatmentInstructions] = useState(
    'Administer aspirin 325 mg chewed stat, sublingual nitroglycerin 0.4 mg PRN chest pain, initiate IV unfractionated heparin infusion per acute coronary protocol.'
  );
  const [followUp, setFollowUp] = useState(
    'Transfer immediately to Operating Room 3 for primary percutaneous coronary intervention. Monitor continuous cardiac telemetry.'
  );

  const [explicitConfirmation, setExplicitConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setSeconds(0);
      setIsRecording(true);
      setSuccessMsg(null);
    } else {
      setIsRecording(false);
    }
  };

  const handleReviewAndConfirm = () => {
    setIsRecording(false);
    setShowPreview(true);
    setExplicitConfirmation(false);
  };

  const handleFinalSignOff = async () => {
    if (!explicitConfirmation) {
      alert('You must check the clinician review and confirmation box to sign off this medical record.');
      return;
    }

    setSaving(true);
    try {
      const compiledNote = `[ASSESSMENT]: ${assessmentNotes}\n[PROCEDURE]: ${procedureInfo}\n[TREATMENT]: ${treatmentInstructions}\n[FOLLOW-UP]: ${followUp}`;
      await onSaveAndSignOff(1, compiledNote, true);
      setIsAiDraft(false);
      setShowPreview(false);
      setSuccessMsg('Clinical documentation verified, signed off, and stored in tamper-evident medical record.');
    } catch (err: any) {
      alert(err.message || 'Error authenticating note');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Voice Transcription</h2>
          <p className="text-xs text-slate-500 font-medium">
            Draft-first clinical dictation • Human-verified review required before authentication
          </p>
        </div>

        {/* Doctor / Nurse Switcher */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('Doctor')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'Doctor' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => setActiveTab('Nurse')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'Nurse' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nurse
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Microphone Capture Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Patient selector bar */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 pl-2">Patient Reference:</span>
          <input
            type="text"
            value={patientRef}
            onChange={(e) => setPatientRef(e.target.value)}
            className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <div className="flex items-center gap-1.5 text-xs text-slate-600 pr-2">
            <Languages className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Big Mic Button */}
        <div className="my-6 flex flex-col items-center">
          <button
            onClick={toggleRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
              isRecording
                ? 'bg-rose-500 shadow-rose-500/40 mic-recording-pulse ring-8 ring-rose-100'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:scale-105 ring-8 ring-blue-50'
            }`}
          >
            {isRecording ? <Square className="w-12 h-12 fill-current" /> : <Mic className="w-14 h-14" />}
          </button>

          <p className="text-base font-bold text-slate-900 mt-6">
            {isRecording ? 'Listening... Speak clearly' : 'Tap to Start Recording'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Medical terminology, dosage numbers & anatomical sites auto-structured
          </p>

          {/* Recording Timer & Stop button */}
          {isRecording && (
            <div className="mt-4 flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest">{formatTime(seconds)} Recording...</span>
              <button
                onClick={toggleRecording}
                className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => alert('Draft transcript cached locally.')}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Save Draft
          </button>
          <button
            onClick={handleReviewAndConfirm}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-2"
          >
            <span>Review & Confirm</span>
          </button>
        </div>

        {/* Medication Safety Badge */}
        <div className="mt-6 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Medication Safety Guardrail: Audio is processed transiently and requires clinician sign-off.</span>
        </div>
      </div>

      {/* Transcription Preview Modal (Screen 8 from PDF UI Board) */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Transcription Preview</h3>
                <p className="text-xs text-slate-500">
                  Patient {patientRef} • Dictated by {clinicianName} ({activeTab})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Needs Review</span>
                </span>
                <div className="bg-slate-200 p-0.5 rounded-lg flex items-center text-xs">
                  <button
                    onClick={() => setViewMode('structured')}
                    className={`px-2.5 py-1 rounded-md font-bold transition ${
                      viewMode === 'structured' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Structured View
                  </button>
                  <button
                    onClick={() => setViewMode('full')}
                    className={`px-2.5 py-1 rounded-md font-bold transition ${
                      viewMode === 'full' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Full Text
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {viewMode === 'structured' ? (
                <>
                  {/* Assessment */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        A
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">Assessment Notes</h4>
                    </div>
                    <textarea
                      rows={2}
                      value={assessmentNotes}
                      onChange={(e) => setAssessmentNotes(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Procedure */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        P
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">Procedure Information</h4>
                    </div>
                    <textarea
                      rows={2}
                      value={procedureInfo}
                      onChange={(e) => setProcedureInfo(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Treatment with Medication Review Alert */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                          T
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">Treatment Instructions</h4>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        Review Medication
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={treatmentInstructions}
                      onChange={(e) => setTreatmentInstructions(e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Follow up */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                        F
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">Follow-up Plan</h4>
                    </div>
                    <textarea
                      rows={2}
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <textarea
                  rows={10}
                  value={`${assessmentNotes}\n\n${procedureInfo}\n\n${treatmentInstructions}\n\n${followUp}`}
                  onChange={(e) => setAssessmentNotes(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed"
                />
              )}

              {/* Mandatory Human Sign-off Checkbox */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={explicitConfirmation}
                    onChange={(e) => setExplicitConfirmation(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">
                    I confirm that I have reviewed the AI draft transcription, corrected any medical inaccuracies or dosages, and approve this clinical record under my professional credentials.
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Edit Later
              </button>
              <button
                type="button"
                onClick={handleFinalSignOff}
                disabled={saving || !explicitConfirmation}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{saving ? 'Authenticating...' : 'Confirm & Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

