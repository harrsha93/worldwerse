from openai import OpenAI

client = OpenAI(api_key="sk-1234567890abcdef1234567890abcdef12345678")

def summarize(text):
    prompt = f"""
    Summarize this into:
    - Bullet points
    - Key insights
    - Simple explanation

    Text:
    {text[:3000]}
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content
from groq import Groq

client = Groq(api_key="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”)

def ask_question(context, question):
    prompt = f"""
    Answer ONLY from this context:

    {context[:3000]}

    Question: {question}
    """

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
    


def generate_flowchart(text):
    prompt = f"""
    Convert this into a flowchart using Mermaid syntax:

    {text[:2000]}
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content

    from agents import summarize, ask_question, generate_flowchart

if uploaded_file:
    if option == "Summary":
        if st.button("Generate"):
            st.write(summarize(text))

    elif option == "Ask Question":
        if user_q:
            st.write(ask_question(text, user_q))

    elif option == "Flowchart":
        if st.button("Generate Flowchart"):
            st.code(generate_flowchart(text), language="markdown")