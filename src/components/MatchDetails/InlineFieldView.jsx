import React, { useEffect } from "react";
import { useFootballStore } from "../store/football";
import DefaultPlayerIcon from "./DefaultPlayerIcon";

const InlineFieldView = ({ startXI, formation }) => {
  const { players, fetchPlayerProfile } = useFootballStore();

  useEffect(() => {
    if (!startXI) return;
    let idsToFetch = [];
    for (const p of startXI) {
      if (
        !p.player.photo &&
        p.player.id &&
        (!players[p.player.id] || (!players[p.player.id].profile && !players[p.player.id].loading))
      ) {
        idsToFetch.push(p.player.id);
      }
    }
    if (idsToFetch.length > 0) {
      idsToFetch.forEach((id) => {
        fetchPlayerProfile(id);
      });
    }
    // eslint-disable-next-line
  }, [startXI, formation]);

  if (!startXI || startXI.length === 0) return null;
  let formationArr = [];
  if (formation && /^\d+(?:-\d+)+$/.test(formation)) {
    formationArr = formation.split('-').map(Number);
  }
  const gk = startXI.filter(p => p.player.pos === 'G');
  let outfield = startXI.filter(p => p.player.pos !== 'G');
  let lines = [];
  if (formationArr.length > 0 && outfield.length === formationArr.reduce((a, b) => a + b, 0)) {
    let idx = 0;
    lines = [gk];
    for (let n of formationArr) {
      lines.push(outfield.slice(idx, idx + n));
      idx += n;
    }
  } else {
    const byPos = { DEF: [], MID: [], ATT: [] };
    outfield.forEach(p => {
      if (p.player.pos === 'D') byPos.DEF.push(p);
      else if (p.player.pos === 'M') byPos.MID.push(p);
      else if (p.player.pos === 'F') byPos.ATT.push(p);
      else byPos.MID.push(p);
    });
    lines = [gk, byPos.DEF, byPos.MID, byPos.ATT];
  }

  return (
    <div className="w-full flex flex-col items-center mb-2">
      <div className="relative w-full max-w-lg aspect-[2/3] bg-green-900 rounded-xl border-4 border-white overflow-hidden shadow-2xl mx-auto" style={{background: 'url("/field-texture.png"), linear-gradient(160deg, #3a7d3a 0%, #1e3d1e 100%)', backgroundSize: 'cover'}}>
        {/* Center line, circle, penalty boxes, etc. as before */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-white/60 z-10" style={{transform: 'translateX(-50%)'}} />
        <div className="absolute left-1/2 top-1/2 w-24 h-24 border-4 border-white/80 rounded-full z-10" style={{transform: 'translate(-50%,-50%)'}} />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-16 border-4 border-white/80 rounded-b-2xl z-10" style={{borderTop:0}} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-16 border-4 border-white/80 rounded-t-2xl z-10" style={{borderBottom:0}} />
        {/* Players */}
        <div className="relative z-20 flex flex-col justify-between h-full w-full py-6">
          {lines.map((line, i) => (
            
            <div key={i} className="flex justify-center gap-8 mb-4 last:mb-0 first:mt-4">
              {line.map((p, j) => {
                let photo = p.player.photo;
                if (!photo && p.player.id && players[p.player.id]?.profile?.photo) {
                  photo = players[p.player.id].profile.photo;
                }
                if (!photo) photo = '/default-player.png';
                return (
                  <div key={p.player.id || p.player.name || j} className="flex flex-col items-center relative group">
                    
                    {/* Player photo */}
                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden bg-gray-300 flex items-center justify-center">
                      {photo && photo !== '/default-player.png' ? (
                        <img src={photo} alt={p.player.name} className="w-full h-full object-cover" />
                      ) : (
                        <DefaultPlayerIcon />
                      )}
                    </div>
                    {/* Player number and name */}
                    <span className="text-xs text-white font-bold mt-1 drop-shadow text-center">{p.player.number} {p.player.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InlineFieldView; 