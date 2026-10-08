import json
from pathlib import Path
from datetime import date
from math import isclose
ROOT=Path(__file__).parent
d={'services': json.loads((ROOT.parent/'src/data/service-samples.json').read_text())}
checks=[]
def ok(condition,label):
 if not condition: raise AssertionError(label)
 checks.append(label)
def eq(a,b,label): ok(isclose(a,b,rel_tol=1e-10,abs_tol=1e-8),label)
names=['Margin Check','Four-Week Cash Snapshot','Plan vs Actual Review','AI Finance Workflow Setup','Plan a hire or expansion','Understand cash and profit','Assess marketing performance','Make reporting more useful']
ok([s['name'] for s in d['services']]==names,'All eight service names match current main, in the intended order')
ok(len(set(s['id'] for s in d['services']))==8,'Eight unique stable service IDs')
for s in d['services']:
 ok(len(s['qa'])==3,s['name']+': exactly three prewritten Q&As')
 ok([q['question'] for q in s['qa']]==['What does this mean?','Why is this happening?','What should I do next?'],s['name']+': standard explanatory questions')
 for key in ['question','scope','problem','finding','nextStep','inputLabel']:
  ok(bool(s[key]),s['name']+': nonempty '+key)
 for obj in [s['inputs'],s['scenario']]:
  for c in obj['columns']:
   ok(c['format'] in ['currency','integer','percent','text'],s['name']+': supported table format '+c['key'])
  for row in obj['rows']:
   for c in obj['columns']:
    ok(c['key'] in row,s['name']+': cell exists '+c['key'])
    if c['format']!='text':ok(isinstance(row[c['key']],(float,int)),s['name']+': numerical cell '+c['key'])
 for m in s['metrics']:ok(isinstance(m['value'],(float,int)),s['name']+': numerical metric '+m['label'])
M,C,P,A,H,B,K,R=d['services']
r=M['inputs']['rows'];ok(len(r)<=10,'Margin scope at most 10 items')
rev=sum(x['revenue'] for x in r);cost=sum(x['directCosts'] for x in r)
eq(rev,50000,'Margin revenue total');eq(cost,38000,'Margin direct costs total');eq(rev-cost,12000,'Margin contribution');eq((rev-cost)/rev*100,24,'Margin percent')
for x in M['scenario']['rows']:
 eq(x['revenue']-x['directCosts'],x['contribution'],'Margin scenario contribution '+x['case']);eq(x['contribution']/x['revenue']*100,x['margin'],'Margin scenario margin '+x['case'])
r=C['inputs']['rows'];ok(len(r)<=20,'Cash scope at most 20 entries')
eq(sum(x['amount'] for x in r if x['direction']=='In'),115000,'Cash receipt sum');eq(sum(x['amount'] for x in r if x['direction']=='Out'),110000,'Cash payment sum')
start=date(2026,11,2);ends=[date(2026,11,x) for x in [8,15,22,29]]
for delayed,col in [(False,'baseClosing'),(True,'delayedClosing')]:
 events=[]
 for x in r:
  when=date.fromisoformat(x['date'])
  if delayed and x['item']=='Customer receipt C':when=date(2026,11,26)
  ok(start<=when<=ends[-1],'Cash date inside four-week period')
  events.append((when,x['amount']*(1 if x['direction']=='In' else -1)))
 balances=[30000];amount=30000
 for when,value in sorted(events):amount+=value;balances.append(amount)
 for i,end in enumerate(ends):
  bal=30000+sum(value for when,value in events if when<=end)
  eq(bal,C['scenario']['rows'][i][col],f'Cash {col} week {i+1}')
 eq(amount,35000,'Cash final '+col);eq(min(balances),-10000 if delayed else 15000,'Cash event-level minimum '+col)
r=P['inputs']['rows'];ok(len(set(x['month'] for x in r))<=3,'Plan scope at most three months');ok(len(set(x['category'] for x in r))<=15,'Plan scope at most 15 categories')
p=lambda key:sum(x[key]*(1 if x['kind']=='Income' else -1) for x in r)
eq(p('planned'),45000,'Plan surplus');eq(p('actual'),22000,'Actual surplus');eq(p('actual')-p('planned'),-23000,'Surplus difference')
agg={}
for x in r:
 a=agg.setdefault(x['category'],{'planned':0,'actual':0,'kind':x['kind']})
 for k in ['planned','actual']:a[k]+=x[k]
ranked=sorted(agg,key=lambda k:abs(agg[k]['actual']-agg[k]['planned']),reverse=True)
ok(ranked[:3]==[x['category'] for x in P['scenario']['rows']],'Top three variances independently ranked by absolute value')
for x in P['scenario']['rows']:
 for k in ['planned','actual']:eq(x[k],agg[x['category']][k],'Variance table aggregate '+x['category']+' '+k)
r=A['inputs']['rows'];asum=lambda key:sum(x[key]*(1 if x['kind']=='Income' else -1) for x in r)
eq(asum('planned'),15000,'AI planned subtotal');eq(asum('actual'),5000,'AI actual subtotal');eq(asum('actual')-asum('planned'),-10000,'AI variance');ok(bool(A['draftCommentary']),'AI includes prewritten draft')
ok('prewritten, not a live AI chat' in A['inputs']['note'],'AI clearly identifies the prewritten demonstration')
for src,out in zip(H['inputs']['rows'],H['scenario']['rows']):
 eq(src['revenue']-src['directCosts']-src['existingFixedCosts']-src['hireCost'],out['operatingSurplus'],'Hire recurring surplus '+src['case'])
 eq(60000+out['operatingSurplus']-src['setupCash'],out['closingCash'],'Hire first-month cash '+src['case'])
 eq((src['revenue']-src['directCosts'])/src['revenue'],.5,'Hire contribution rate '+src['case'])
eq(30000/.5,60000,'Hire recurring break-even incremental sales');eq(90000-70000,20000,'Hire cash effect compared with no hire')
b=[x['amount'] for x in B['inputs']['rows']];eq(b[0]-b[2]-b[4],30000,'Cash/profit operating profit');eq(b[0]-b[1],40000,'Cash/profit receivable increase');eq(b[2]-b[3],15000,'Cash/profit payable increase');eq(b[1]-b[3]-b[4]-b[5],-15000,'Cash/profit direct cash reconciliation');eq(sum(x['cashEffect'] for x in B['scenario']['rows'][:-1]),-15000,'Cash/profit bridge reconciliation');eq(b[6]-15000,35000,'Cash/profit closing cash')
for src,out in zip(K['inputs']['rows'],K['scenario']['rows']):
 n=src['newCustomers'];eq(src['revenue']/n,out['revenuePerCustomer'],'Marketing revenue per customer '+src['channel']);eq(src['directCosts']/n,out['directCostPerCustomer'],'Marketing direct cost per customer '+src['channel']);eq((src['revenue']-src['directCosts'])/n,out['contributionBeforeAds'],'Marketing contribution before ads '+src['channel']);eq(src['spend']/n,out['acquisitionCost'],'Marketing acquisition cost '+src['channel']);eq((src['revenue']-src['directCosts']-src['spend'])/n,out['contributionAfterAds'],'Marketing contribution after ads '+src['channel'])
eq(sum(x['revenue']-x['directCosts']-x['spend'] for x in K['inputs']['rows']),5200,'Marketing combined after-ad contribution')
r=R['inputs']['rows'];previous=r[0]['previous']-r[1]['previous'];current=r[0]['current']-r[1]['current']
eq(previous,40000,'Reporting previous contribution');eq(current,42000,'Reporting current contribution');eq(previous/r[0]['previous']*100,40,'Reporting previous margin');eq(current/r[0]['current']*100,35,'Reporting current margin');eq((r[0]['current']/r[0]['previous']-1)*100,20,'Reporting revenue growth');eq((r[1]['current']/r[1]['previous']-1)*100,30,'Reporting direct-cost growth');eq((current/previous-1)*100,5,'Reporting contribution growth');eq(35-40,-5,'Reporting percentage-point margin change');eq(r[2]['current']-r[2]['previous'],15000,'Reporting overdue increase')
(ROOT.parent/'review-artifacts').mkdir(exist_ok=True)
report={'status':'passed','checkCount':len(checks),'checks':checks,'notes':['All data is newly created and fictional.','No external data uploads, API calls or live AI execution are part of the demonstrations.','Source names and scopes verified against current main on 2026-10-08.','Cash was checked at every listed date, not just week-end.']}
(ROOT.parent/'review-artifacts/sample-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(f'PASS: {len(checks)} assertions across eight service examples')
