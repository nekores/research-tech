@echo off
set src_ko=.\packages\survey-knockout
set src_re=.\packages\survey-react
set tgtv1=..\survey-creator\packages\survey-creator\node_modules\survey-knockout
::set tgtv2=..\survey-creator\packages\survey-creator\node_modules\survey-knockout
set tgtv3=..\survey-creator\packages\survey-creator-core\node_modules\survey-knockout
set tgtv4=..\survey-creator\packages\survey-creator-knockout\node_modules\survey-knockout
set tgtv5=..\survey-creator\packages\survey-creator-react\node_modules\survey-react
set tgtv6=..\survey-creator\packages\survey-creator-react\node_modules\survey-knockout
if exist %tgtv1% xcopy %src_ko%\*.* %tgtv1% /Y /Q
::if exist %tgtv2% xcopy %src_ko%\*.* %tgtv2% /Y /Q
if exist %tgtv3% xcopy %src_ko%\*.* %tgtv3% /Y /Q
if exist %tgtv4% xcopy %src_ko%\*.* %tgtv4% /Y /Q

if exist %tgtv5% xcopy %src_re%\*.* %tgtv5% /Y /Q
if exist %tgtv6% xcopy %src_ko%\*.* %tgtv6% /Y /Q