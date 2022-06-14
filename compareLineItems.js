import { LightningElement, track, api, wire } from "lwc";
import getProposalList from "@salesforce/apex/getProposals.getProposalList";
import getLineItems from "@salesforce/apex/getProposals.getLineItems";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript } from "lightning/platformResourceLoader";
import JSPDF from "@salesforce/resourceUrl/jspdf";
import JSPDFAUTOTABLE from "@salesforce/resourceUrl/jspdfAutotable";
import COLORS from '@salesforce/resourceUrl/colors';

const columns = [
{ label: "Description", fieldName: "APTS_Misc_Description__c", cellAttributes:{
  class:{fieldName:'industryColor'}
} },
{ label: "Quantity", fieldName: "Apttus_Proposal__Quantity__c", cellAttributes:{
  class:{fieldName:'industryColor'}
}},
{
  label: "Proposed Price Display",
  fieldName: "APTS_Proposed_Price_Display__c",
  cellAttributes:{
        class:{fieldName:'industryColor'}
    }
},
{ label: "Weight", 
fieldName: "APTS_Weight__c" ,
cellAttributes:{
  class:{fieldName:'industryColor'}
}}
];

const columns1 =  [
{ label: "Description", fieldName: "APTS_Misc_Description__c", cellAttributes:{
  class:{fieldName:'industryColor'}
} },
{ label: "Quantity", fieldName: "Apttus_Proposal__Quantity__c", cellAttributes:{
  class:{fieldName:'industryColor'}
}},
{
  label: "Proposed Price Display",
  fieldName: "APTS_Proposed_Price_Display__c",
  cellAttributes:{
        class:{fieldName:'industryColor'}
    }
},
{ label: "Weight", 
fieldName: "APTS_Weight__c" ,
cellAttributes:{
  class:{fieldName:'industryColor'}
}}
];

export default class CompareLineItems extends LightningElement {
@api recordId;

// value='';
//  value1='';
selectedValueLeft = "";
selectedValueRight = "";

lineItemsData = [];

accOptions = [];
cardVisible = false;
columnsField = columns;
columnsData = columns1;

dataLeft = [];
dataRight = [];



get options() {
  return this.accOptions;
}






connectedCallback() {
  setTimeout(() => {
    getProposalList({ lwcRecordId: this.recordId }).then((result) => {
      let arr = [];
      for (var i = 0; i < result.length; i++) {
        arr.push({ label: result[i].Name, value: result[i].Id });
      }
      this.accOptions = arr;
    });
  }, 5);
}

UpdateLeftValues(event) {
  this.selectedValueLeft = event.target.value;
}

UpdateRightValues(event) {
  this.selectedValueRight = event.target.value;
}

handleCompare() {
  if (this.selectedValueLeft === this.selectedValueRight) {
    this.cardVisible = false;
    this.showToast();
  } else if (
    this.selectedValueLeft === "" ||
    this.selectedValueRight === ""
  ) {
    this.showToast1();
    this.cardVisible = false;
  } else {
    this.cardVisible = true;
    this.loadLeftItems();
    this.loadRightItems();
  }
  
}
   
//   var arr1 = this.dataLeft
//  var arr2 = this.dataRight

handleCompareHighlight(){
  this.arraysAreIdentical(this.dataLeft,this.dataRight);


}

arraysAreIdentical(arr1, arr2){
  for (var i = 0, len = arr1.length; i < len; i++){
    if (arr1[i] !== arr2[i]) {
    
      console.log("no match", arr1[i], arr2[i]);

      }
      else
    {
      console.log("yes match", arr1[i], arr2[i]);
  }
    
}
    }
 
//  arraysAreIdentical(arr1, arr2){
//     for (var i = 0, len = arr1.length; i < len; i++){
//       if (arr1[i] !== arr2[i]) {
      
//         arr1[i].map(item=>{
//           return {...item, 
//             "industryColor":"slds-text-color_error"
          
//           }
//     })

//         }
//         else
//       {
//         console.log("yes match", arr1[i], arr2[i]);
//     }
      
//   }
//       }
    
      


  
//   const arr1 = this.dataLeft
// const arr2 = this.dataRight



/* for (var i = 0, len = arr1.length; i < len; i++){
  if (arr1[i] !== arr2[i]){
    console.log("no match", arr1[i], arr2[i]);
        
  }
  else{
    console.log("yes match", arr1[i], arr2[i]);
  }
  
 
  
} */



// for (let i = 0; i < arr1.length; i++) {
//   for (let j = 0; j < arr2.length; j++) {
//       if (arr1[i] === arr2[j]) {
//           console.log("yes match", arr1[i], arr2[j]);
//           
//       }
//       console.log("no match", arr1[i], arr2[j]);
//   }
// }

// if (arr1.length !== arr2.length) return console.log("false");
// for (let i = 0; i < arr1.length; i++) {
//     for (let j = 0; j < arr2.length; j++) {
//         if (arr1[i] === arr2[j]) {
//             console.log("yes match", arr1[i], arr2[j]);
//             continue;
//         }
//         console.log("no match", arr1[i], arr2[j]);
//     }
// }

 

//   var array1 = this.dataLeft
// var array2 = this.dataRight
// var str='';
// for(var i=0;i<array1.length;i++){
//         if(array2.indexOf(array1[i]) != -1){
//            str+=array1[i]+' ';
//        };
//     }
// console.log("str"+str)

// let isEqual = JSON.stringify(this.dataLeft) === JSON.stringify(this.dataRight);
// console.log(isEqual);


loadLeftItems() {
  getLineItems({ selectedProposal: this.selectedValueLeft })
    .then((response) => {
      // this.dataLeft=response;
      this.dataLeft = response;
      
      console.log(this.dataLeft);
    })
    .catch((error) => {
      // window.alert("Some error occured")
    });
}

loadRightItems() {
  getLineItems({ selectedProposal: this.selectedValueRight })
    .then((response) => {
      // this.dataRight=response;
      this.dataRight = response;

      console.log(this.dataRight);
    })
    .catch((error) => {
      this.error=error;
    });
}



showToast() {
  const evt1 = new ShowToastEvent({
    title: "ERROR",
    message: "Both the values cannot be same for comparison",
    variant: "error"
  });

  this.dispatchEvent(evt1);
}

showToast1() {
  const evt = new ShowToastEvent({
    title: "ERROR",
    message: "Select both values to compare",
    variant: "error"
  });

  this.dispatchEvent(evt);
}

generateExcel(){
  
  const leftLineItems = this.dataLeft;
  let rightLineItems = this.dataRight;
  var leftCol = [];
  var rightCol = [];

  leftLineItems.forEach(function (record) {
    leftCol.push({
      Description: record.APTS_Misc_Description__c,
        Quantity: record.Apttus_Proposal__Quantity__c,
        Weight: record.APTS_Weight__c,
        ProposedPriceDisplay: record.APTS_Proposed_Price_Display__c
  });
  });

  rightLineItems.forEach(function (record) {
    rightCol.push({
      Description: record.APTS_Misc_Description__c,
        Quantity: record.Apttus_Proposal__Quantity__c,
        Weight: record.APTS_Weight__c,
        ProposedPriceDisplay: record.APTS_Proposed_Price_Display__c
  });
  });
  var ws1 = XLSX.utils.json_to_sheet(leftCol, { skipHeader: false,origin: "A1" });
    XLSX.utils.sheet_add_json(ws1,rightCol,{ skipHeader: false,origin: "G1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "comparison");
    XLSX.writeFile(wb, "Output.xls");
  }

renderedCallback() {
  Promise.all([loadScript(this, JSPDF)]);
}

generatePdf() {
  let columns = [
    ["Description", "Quantity", "Weight", "Proposed Price Display"]
  ];
  const leftLineItems = this.dataLeft;
  let rightLineItems = this.dataRight;
  var leftCol = [];
  var rightCol = [];

  leftLineItems.forEach(function (record) {
    leftCol.push([
      record.APTS_Misc_Description__c,
      record.Apttus_Proposal__Quantity__c,
      record.APTS_Weight__c,
      record.APTS_Proposed_Price_Display__c
    ]);
  });

  rightLineItems.forEach(function (record) {
    rightCol.push([
      record.APTS_Misc_Description__c,
      record.Apttus_Proposal__Quantity__c,
      record.APTS_Weight__c,
      record.APTS_Proposed_Price_Display__c
    ]);
  });

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt");

  pdf.text("This is test pdf", 20, 20);
  let startingPage = pdf.internal.getNumberOfPages();
  pdf.autoTable({
    startY: 30,
    showHeader: "firstPage",
    styles: { fontSize: 10 },
    avoidPageSplit: true,
    margin: { right: 300 },
    head: columns,
    body: leftCol,
    theme: "striped"
  });
  pdf.setPage(startingPage);
  pdf.autoTable({
    startY: 30,
    showHeader: "firstPage",
    styles: { fontSize: 10 },
    avoidPageSplit: true,
    margin: { top: 10, left: 300 },
    head: columns,
    body: rightCol,
    theme: "striped"
  });

  pdf.save("demo.pdf");
}

generateData() {
  this.generatePdf();
}

/*exportToCSV() {
  let columnHeader = [
    "Description",
    "Quantity",
    "Weight",
    "Product Price Display"
  ]; // This array holds the Column headers to be displayd
  let jsonKeys = [
    "APTS_Misc_Description__c",
    "Apttus_Proposal__Quantity__c",
    "APTS_Weight__c",
    "APTS_Proposed_Price_Display__c"
  ]; // This array holds the keys in the json data

  var jsonRecordsData = this.dataLeft;
  let csvIterativeData;
  let csvSeperator;
  let newLineCharacter;
  csvSeperator = ",";
  newLineCharacter = "\n";
  csvIterativeData = "";
  csvIterativeData += columnHeader.join(csvSeperator);
  csvIterativeData += newLineCharacter;
  for (let i = 0; i < jsonRecordsData.length; i++) {
    let counter = 0;

    for (let iteratorObj in jsonKeys) {
      let dataKey = jsonKeys[iteratorObj];
      if (counter > 0) {
        csvIterativeData += csvSeperator;
      }
      if (
        jsonRecordsData[i][dataKey] !== null &&
        jsonRecordsData[i][dataKey] !== undefined
      ) {
        csvIterativeData += '"' + jsonRecordsData[i][dataKey] + '"';
      } else {
        csvIterativeData += '""';
      }
      counter++;
    }
    csvIterativeData += newLineCharacter;
  }
  console.log("csvIterativeData", csvIterativeData);
  //this.hrefdata = "data:text/csv;charset=utf-8," + encodeURI(csvIterativeData);

  let columnHeader1 = [
    "Description",
    "Quantity",
    "Weight",
    "Product Price Display"
  ]; // This array holds the Column headers to be displayd
  let jsonKeys1 = [
    "APTS_Misc_Description__c",
    "Apttus_Proposal__Quantity__c",
    "APTS_Weight__c",
    "APTS_Proposed_Price_Display__c"
  ]; // This array holds the keys in the json data

  var jsonRecordsData1 = this.dataRight;
  let csvIterativeData1;
  let csvSeperator1;
  let newLineCharacter1;
  csvSeperator1 = ",";
  newLineCharacter1 = "\n";
  csvIterativeData1 = "";
  csvIterativeData1 += columnHeader1.join(csvSeperator1);
  csvIterativeData1 += newLineCharacter1;

  for (let i = 0; i < jsonRecordsData1.length; i++) {
    let countervar = 0;
    for (let iteratorObj1 in jsonKeys1) {
      let dataKey1 = jsonKeys1[iteratorObj1];

      if (countervar > 0) {
        csvIterativeData1 += csvSeperator1;
      }
      if (
        jsonRecordsData1[i][dataKey1] !== null &&
        jsonRecordsData1[i][dataKey1] !== undefined
      ) {
        csvIterativeData1 += '"' + jsonRecordsData1[i][dataKey1] + '"';
      } else {
        csvIterativeData1 += '""';
      }
      countervar++;
    }
    csvIterativeData1 += newLineCharacter1;
  }
  console.log("csvIterativeData1", csvIterativeData);

  var hiddenElement = document.createElement("a");

  hiddenElement.href =
    "data:text/csv;charset=utf-8," +
    encodeURIComponent(
      csvIterativeData +
        newLineCharacter +
        newLineCharacter +
        csvIterativeData1
    );
  hiddenElement.target = "_self";
  hiddenElement.download = "Quote_Compare.csv";
  document.body.appendChild(hiddenElement);
  hiddenElement.click();

  this.hrefdata =
    "data:text/csv;charset=utf-8," +
    encodeURI(
      csvIterativeData +
        newLineCharacter +
        newLineCharacter +
        csvIterativeData1
    );
}*/
}