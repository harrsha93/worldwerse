#include<stdio.h>
#include<math.h>
#include<stdlib.h>

void main()
{
    float a,b,c,disc,deno,root1,root2,ip,rp;
    printf(" enter three values of the coefficients:\n");
    scanf("%f %f %f",&a,&b,&c);
    if(a==0)
    {
    printf("\n invalid data");
    exit(0);
    }
    disc=(b*b)-(4*a*c);
    deno=2*a;

    if(disc>0)
    {
        printf("\n roots are real and distinct:");
        root1=(-b+sqrt(disc))/(deno);
        root2=(-b-sqrt(disc))/(deno);
        printf("\n\t root1=%f and root2=%f",root1,root2);
    }
    else if(disc==0)
    {
        printf("\n roots are real and equal:");
        printf("\n\t root1=root2=%f",-b/deno);

    }
    else
    {
        printf("\n roots are complex:\n");
        ip=sqrt(fabs(disc))/(deno);
        rp=-b/deno;
        printf("\n\t root1=%f+i%f\n\n\t root2=%f-i%f ",rp,ip,rp,ip);
        
    }


}