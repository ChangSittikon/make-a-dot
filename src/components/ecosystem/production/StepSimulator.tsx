'use client';

import React from 'react';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
} from './types';
import { flattenOpps } from './schema';
import { OppPicker } from './OppPicker';
import { ProfitSimulator } from './ProfitSimulator';
import { ActionKind } from './OppCard';

interface Props {
  chain: ProductChain;
  selectedOppKey: string;
  onSelectOpp: (key: string) => void;
  onAction?: (
    k: ActionKind,
    opp?: MicroOpportunity,
    node?: SupplyChainNode,
    customCashThb?: number
  ) => void;
}

/** 04 ลองคำนวณ — เครื่องคิดเลขต้นทุน-กำไร และจุดคุ้มทุนแบบละเอียด */
export const StepSimulator: React.FC<Props> = ({
  chain,
  selectedOppKey,
  onSelectOpp,
  onAction,
}) => {
  const flat = flattenOpps(chain);
  const cur = flat.find((f) => f.key === selectedOppKey) || flat[0];
  const f = cur.node.five_w_two_h;
  return (
    <div className="p-3 space-y-3 pb-8">
      <OppPicker chain={chain} value={cur.key} onChange={onSelectOpp} />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] p-3 space-y-3">
        <div>
          <div className="text-[9.5px] text-gray-400">โมเดลที่กำลังคำนวณ</div>
          <div className="text-[13px] font-extrabold text-gray-900 dark:text-white">
            {cur.opp.model_name}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            งบลงทุน {cur.opp.capital_required_thb} บ. · กำไรคาดหวัง{' '}
            {cur.opp.expected_margin_percent}
          </div>
        </div>
        <ProfitSimulator
          key={cur.key}
          costDefault={f.how_much_cost_thb}
          priceDefault={f.how_much_selling_thb}
          unitLabel={chain.product.base_unit_reference}
          capital={cur.opp.capital_required_thb}
          detailed
          onSendToCapital={(simulatedCash) =>
            onAction?.('CAPITAL', cur.opp, cur.node, simulatedCash)
          }
          onSendToLocal={() => onAction?.('LOCAL', cur.opp, cur.node)}
        />
      </div>
    </div>
  );
};
