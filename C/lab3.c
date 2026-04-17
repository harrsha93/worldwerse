#include<stdio.h>
#include<string.h>
void main()
{
    int cust_no,unit_con;
    float charge,surcharge=0,amt,total_amt;
    char nm[25];

    printf("Enter customer IDNO:\t");
    scanf("%d",&cust_no);
    printf("Enter the customer name :\t");
    scanf("%s",nm);
    printf(" enter the unit consumed by the customer :\t");
    scanf("%d",&unit_con);

    if(unit_con<200)
      charge=0.80;
    else if(unit_con>=200&&unit_con<300)
      charge=0.90;
    else
      charge=1.00;
    amt=unit_con*charge;
    if(amt>400)
    surcharge=amt*15/100.0;
    total_amt=amt+surcharge;



   printf("\t\t\t\n Electricity bill \n\n");
   printf("Custome IDNO   :\t%d",cust_no);
   printf("\n Customer name :\t%s",nm);
   printf("\n Unit consumed by the customer :\t%d",unit_con);
   printf("\n Amount charges @Rs %4.2f per unit :\t%0.2f",charge,amt);
   printf("\n Surcharge amount :\t%.2f",surcharge);
   printf("\n Minimum meter charge Rs :\t%d",100);
   printf("\n Net amount paid by the customer   :\t%.2f",total_amt+100);

}
