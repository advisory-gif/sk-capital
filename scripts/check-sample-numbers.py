import json
from collections import defaultdict
from copy import deepcopy
from datetime import date
from pathlib import Path
src=Path(__file__).resolve().parent.parent/'src/data/service-samples.json'
d={'services': json.loads(src.read_text())}; s={x['id']:x for x in d['services']}; checks=[]
def check(name, calculated, displayed):
    ok=calculated==displayed if not isinstance(calculated,float) else abs(calculated-displayed)<1e-8
    checks.append({'check':name,'calculated':calculated,'displayed':displayed,'pass':ok})
    assert ok,(name,calculated,displayed)
def metrics(id, values):
    for m,v in zip(s[id]['metrics'],values):check(id+': '+m['label'],v,m['value'])
a=s['margin-check']; r=a['inputs']['rows']; rev=sum(x['revenue'] for x in r); costs=sum(x['directCosts'] for x in r)
metrics(a['id'],[rev,costs,rev-costs,100*(rev-costs)/rev])
for x in a['scenario']['rows']:
    check('margin scenario '+x['case'],x['revenue']-x['directCosts'],x['contribution']);check('margin percent '+x['case'],100*x['contribution']/x['revenue'],x['margin'])
# Reconstruct dated cash balances, including within-week lows, from input events.
a=s['four-week-cash']; base=deepcopy(a['inputs']['rows']); delayed=deepcopy(base)
for x in delayed:
    if x['item']=='Customer receipt C':x['date']='2026-11-26'
def cash_path(entries):
    bal=30000; out=[]
    for x in sorted(entries,key=lambda x:x['date']):
        bal+=x['amount'] if x['direction']=='In' else -x['amount'];out.append((x['date'],bal))
    return out
bp=cash_path(base);dp=cash_path(delayed)
metrics(a['id'],[30000,bp[-1][1],min([30000]+[v for _,v in bp]),-min(v for _,v in dp)])
for i,ending in enumerate(['2026-11-08','2026-11-15','2026-11-22','2026-11-29']):
    for label,path in [('baseClosing',bp),('delayedClosing',dp)]:
        val=[v for dt,v in path if dt<=ending][-1];check('cash '+ending+' '+label,val,a['scenario']['rows'][i][label])
check('cash lowest date',[dt for dt,v in dp if v==min(v for _,v in dp)][0],'2026-11-20')
for id in ['plan-vs-actual','ai-finance-workflow']:
    a=s[id];r=a['inputs']['rows'];p=sum(x['planned']*(1 if x['kind']=='Income' else -1) for x in r);v=sum(x['actual']*(1 if x['kind']=='Income' else -1) for x in r);metrics(id,[p,v,p-v])
    if id=='plan-vs-actual':
        agg=defaultdict(lambda:[0,0])
        for x in r:agg[x['category']][0]+=x['planned'];agg[x['category']][1]+=x['actual']
        ranked=sorted(agg,key=lambda k:abs(agg[k][1]-agg[k][0]),reverse=True)[:3]
        check('variance category ranking',ranked,[x['category'] for x in a['scenario']['rows']])
        for row in a['scenario']['rows']:
            check('variance plan '+row['category'],agg[row['category']][0],row['planned']);check('variance actual '+row['category'],agg[row['category']][1],row['actual'])
a=s['plan-hire-expansion'];r=a['inputs']['rows'];rate=(r[0]['revenue']-r[0]['directCosts'])/r[0]['revenue']
metrics(a['id'],[r[1]['hireCost'],r[1]['hireCost']/rate,r[1]['setupCash'],60000+r[1]['revenue']-r[1]['directCosts']-r[1]['existingFixedCosts']-r[1]['hireCost']-r[1]['setupCash']])
for row,out in zip(r,a['scenario']['rows']):
    v=row['revenue']-row['directCosts']-row['existingFixedCosts']-row['hireCost'];check('hire surplus '+row['case'],v,out['operatingSurplus']);check('hire cash '+row['case'],60000+v-row['setupCash'],out['closingCash'])
a=s['understand-cash-profit'];vals={x['item']:x['amount'] for x in a['inputs']['rows']};r=a['inputs']['rows'];v=[x['amount'] for x in r];profit=v[0]-v[2]-v[4];net=v[1]-v[3]-v[4]-v[5];metrics(a['id'],[profit,net,v[6]+net]);bridge=[profit,-(v[0]-v[1]),v[2]-v[3],-v[5],net]
for n,(x,val) in enumerate(zip(a['scenario']['rows'],bridge)):check('cash bridge '+x['item'],val,x['cashEffect'])
check('bridge reconciles',sum(bridge[:-1]),net)
a=s['assess-marketing'];r=a['inputs']['rows'];metrics(a['id'],[r[0]['revenue']-r[0]['directCosts']-r[0]['spend'],r[1]['revenue']-r[1]['directCosts']-r[1]['spend'],r[0]['spend']/r[0]['newCustomers'],r[1]['spend']/r[1]['newCustomers']])
for x,out in zip(r,a['scenario']['rows']):
    n=x['newCustomers'];calc={'revenuePerCustomer':x['revenue']/n,'directCostPerCustomer':x['directCosts']/n,'contributionBeforeAds':(x['revenue']-x['directCosts'])/n,'acquisitionCost':x['spend']/n,'contributionAfterAds':(x['revenue']-x['directCosts']-x['spend'])/n}
    for k,v in calc.items():check('marketing '+x['channel']+' '+k,v,out[k])
a=s['useful-reporting'];r=a['inputs']['rows'];metrics(a['id'],[100*(r[0]['current']/r[0]['previous']-1),100*(r[0]['current']-r[1]['current'])/r[0]['current'],r[2]['current'],r[3]['current']]);check('prior margin',100*(r[0]['previous']-r[1]['previous'])/r[0]['previous'],40);check('contribution growth',100*((r[0]['current']-r[1]['current'])/(r[0]['previous']-r[1]['previous'])-1),5);check('direct cost growth',100*(r[1]['current']/r[1]['previous']-1),30)
report={'source':str(src),'scope':'Independent recomputation from input rows and explicit opening-balance/scenario assumptions; not a rerun of author checks','checks':checks,'count':len(checks),'allPass':all(x['pass'] for x in checks),'cashPaths':{'base':bp,'delayed':dp}}
(src.parents[2]/'review-artifacts/independent-sample-number-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'count':len(checks),'allPass':report['allPass'],'cashPaths':report['cashPaths']},indent=2))
