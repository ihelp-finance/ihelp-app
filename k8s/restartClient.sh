#!/bin/bash

pods=( $(kubectl get pods -n ihelp-app | grep client | awk '{print $1}') )

# pods=(  )

#echo ${pods[@]}

for pod in ${pods[@]}; do

        echo $pod
        
        #chmod 777 /core/ihelp/ihelp-app/client/src/refresh.js -Rf
        kubectl exec -it $pod -n ihelp-app -- touch /core/src/views/refresh.jsx

done
