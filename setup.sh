#!/bin/sh

edit () {
    sed -i '' -e 's/Abcd/Jut/g' -e 's/abcd/jut/g' -e 's/ABCD/JUT/g' "$file"
    mv $file $(echo $file | sed -e 's/Abcd/Jut/')
    echo $file

}

for file in $(find . -name "*.ts*")
do
    edit
done


for file in $(find . -name "*.json")
do
    edit
done
